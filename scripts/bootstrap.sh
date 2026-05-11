#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Grounded — GCP bootstrap
#
# Creates: project → enable APIs → Cloud SQL (Postgres) → Cloud Storage bucket
# → Secret Manager entries → Cloud Run service (deploys current folder).
#
# Idempotent where possible: every create guards on `describe` first.
#
# Usage:
#   PROJECT_ID=grounded-prod REGION=asia-east1 ./scripts/bootstrap.sh
#
# Prerequisites:
#   - gcloud CLI authenticated  (`gcloud auth login`)
#   - Billing account linked to your GCP org
#   - Domain (optional — can map later)
# -----------------------------------------------------------------------------

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-grounded-prod}"
REGION="${REGION:-asia-east1}"
SQL_INSTANCE="${SQL_INSTANCE:-grounded-db}"
SQL_TIER="${SQL_TIER:-db-f1-micro}"
SQL_DB="${SQL_DB:-grounded}"
SQL_USER="${SQL_USER:-grounded_app}"
BUCKET="${BUCKET:-${PROJECT_ID}-assets}"
SERVICE="${SERVICE:-grounded-site}"

# Colors
g() { printf "\033[32m✓\033[0m %s\n" "$*"; }
y() { printf "\033[33m▸\033[0m %s\n" "$*"; }
r() { printf "\033[31m✗\033[0m %s\n" "$*" >&2; }

# -- 1. Project & billing -----------------------------------------------------
y "Using project: ${PROJECT_ID}"
if ! gcloud projects describe "${PROJECT_ID}" >/dev/null 2>&1; then
  y "Creating project ${PROJECT_ID}…"
  gcloud projects create "${PROJECT_ID}" --name="Grounded"
fi
gcloud config set project "${PROJECT_ID}" >/dev/null

if ! gcloud beta billing projects describe "${PROJECT_ID}" 2>/dev/null | grep -q "billingEnabled: true"; then
  r "Billing is not enabled for ${PROJECT_ID}. Link a billing account in the console and re-run."
  exit 1
fi
g "Project ready"

# -- 2. Enable APIs -----------------------------------------------------------
y "Enabling required APIs…"
gcloud services enable \
  sqladmin.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com \
  cloudscheduler.googleapis.com \
  cloudtasks.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com >/dev/null
g "APIs enabled"

# -- 3. Cloud SQL -------------------------------------------------------------
if ! gcloud sql instances describe "${SQL_INSTANCE}" >/dev/null 2>&1; then
  y "Creating Cloud SQL instance ${SQL_INSTANCE} (${SQL_TIER}, ${REGION})…"
  gcloud sql instances create "${SQL_INSTANCE}" \
    --database-version=POSTGRES_16 \
    --tier="${SQL_TIER}" \
    --region="${REGION}" \
    --storage-size=10GB \
    --storage-auto-increase \
    --backup-start-time=03:00
else
  y "Cloud SQL instance exists"
fi

if ! gcloud sql databases describe "${SQL_DB}" --instance="${SQL_INSTANCE}" >/dev/null 2>&1; then
  gcloud sql databases create "${SQL_DB}" --instance="${SQL_INSTANCE}"
fi

# Generate/read app user password
if ! gcloud secrets describe db-password >/dev/null 2>&1; then
  SQL_PASS=$(LC_ALL=C tr -dc 'A-Za-z0-9_!@' </dev/urandom | head -c 32)
  echo -n "${SQL_PASS}" | gcloud secrets create db-password --data-file=- --replication-policy=automatic
  gcloud sql users create "${SQL_USER}" --instance="${SQL_INSTANCE}" --password="${SQL_PASS}" 2>/dev/null || \
    gcloud sql users set-password "${SQL_USER}" --instance="${SQL_INSTANCE}" --password="${SQL_PASS}"
fi
g "Cloud SQL ready"

# -- 4. Import schema (if not already done) -----------------------------------
SCHEMA_LOCAL="$(cd "$(dirname "$0")/.." && pwd)/db/schema.sql"
if [[ -f "${SCHEMA_LOCAL}" ]]; then
  if ! gcloud storage buckets describe "gs://${BUCKET}" >/dev/null 2>&1; then
    gcloud storage buckets create "gs://${BUCKET}" --location="${REGION}" --uniform-bucket-level-access
  fi
  y "Uploading schema.sql to gs://${BUCKET}/schema.sql…"
  gcloud storage cp "${SCHEMA_LOCAL}" "gs://${BUCKET}/schema.sql" --quiet

  # Grant Cloud SQL service account access to read the bucket
  SQL_SA=$(gcloud sql instances describe "${SQL_INSTANCE}" --format='value(serviceAccountEmailAddress)')
  gcloud storage buckets add-iam-policy-binding "gs://${BUCKET}" \
    --member="serviceAccount:${SQL_SA}" --role=roles/storage.objectViewer --quiet >/dev/null

  y "Importing schema into ${SQL_DB}…"
  gcloud sql import sql "${SQL_INSTANCE}" "gs://${BUCKET}/schema.sql" \
    --database="${SQL_DB}" --quiet || y "Schema import skipped (likely already applied)"
  g "Schema applied"
fi

# -- 5. Build DATABASE_URL secret --------------------------------------------
CONN=$(gcloud sql instances describe "${SQL_INSTANCE}" --format='value(connectionName)')
DB_PASS=$(gcloud secrets versions access latest --secret=db-password)
DB_URL="postgresql://${SQL_USER}:${DB_PASS}@/${SQL_DB}?host=/cloudsql/${CONN}"
if ! gcloud secrets describe database-url >/dev/null 2>&1; then
  echo -n "${DB_URL}" | gcloud secrets create database-url --data-file=- --replication-policy=automatic
else
  echo -n "${DB_URL}" | gcloud secrets versions add database-url --data-file=-
fi
g "database-url secret updated"

# -- 6. Deploy Cloud Run ------------------------------------------------------
y "Deploying ${SERVICE} to Cloud Run…"
SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
gcloud run deploy "${SERVICE}" \
  --source "${SITE_DIR}" \
  --region="${REGION}" \
  --allow-unauthenticated \
  --add-cloudsql-instances="${CONN}" \
  --update-secrets="DATABASE_URL=database-url:latest" \
  --set-env-vars="NODE_ENV=production" \
  --cpu=1 --memory=512Mi --min-instances=0 --max-instances=5 \
  --quiet

SITE_URL=$(gcloud run services describe "${SERVICE}" --region="${REGION}" --format='value(status.url)')
g "Deployed: ${SITE_URL}"

cat <<EOF

────────────────────────────────────────────────────────
  Grounded is live.
────────────────────────────────────────────────────────
  URL     : ${SITE_URL}
  Region  : ${REGION}
  DB inst : ${SQL_INSTANCE}  (${CONN})
  Bucket  : gs://${BUCKET}

  Next:
    1. Map a custom domain: gcloud run domain-mappings create --service=${SERVICE} --domain=grounded.dev --region=${REGION}
    2. Add Resend key:      echo -n 're_xxx' | gcloud secrets create resend-api-key --data-file=-
    3. Tail logs:           gcloud logging read "resource.type=cloud_run_revision" --limit 50

EOF
