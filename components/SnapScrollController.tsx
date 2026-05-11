"use client";

import { useEffect } from "react";

/**
 * One-gesture-per-section scroll. A single wheel tick, trackpad swipe,
 * touch swipe, or key press moves exactly one section — forward or back,
 * symmetric in both directions.
 *
 * Strategy:
 *  - Find all `.snap-section` elements on the page.
 *  - Intercept wheel/touch/key events, debounce with a lock window.
 *  - Determine current section by distance to viewport top (accounting
 *    for the 64px fixed nav), then scroll to the adjacent section.
 *  - Once past the last snap-section, release control so Footer scrolls
 *    natively.
 *  - Respects `prefers-reduced-motion` — then it does nothing.
 */

const NAV_OFFSET = 64; // fixed nav height
const LOCK_MS = 900; // debounce after a programmatic scroll
const WHEEL_THRESHOLD = 8; // ignore jitter
const TOUCH_THRESHOLD = 40;

export default function SnapScrollController() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) return;

    let locked = false;
    let lockTimer: ReturnType<typeof setTimeout> | null = null;

    const sections = (): HTMLElement[] =>
      Array.from(document.querySelectorAll<HTMLElement>(".snap-section"));

    const currentIndex = () => {
      const all = sections();
      if (!all.length) return 0;
      const y = window.scrollY + NAV_OFFSET + 8;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < all.length; i++) {
        const top = all[i].getBoundingClientRect().top + window.scrollY;
        const dist = Math.abs(top - y);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    };

    const goTo = (idx: number) => {
      const all = sections();
      if (idx < 0 || idx >= all.length) return false;
      locked = true;
      all[idx].scrollIntoView({ behavior: "smooth", block: "start" });
      if (lockTimer) clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        locked = false;
      }, LOCK_MS);
      return true;
    };

    const isEditable = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (el.isContentEditable) return true;
      return false;
    };

    // Pass native scroll through once we're past the last snap-section
    // (e.g. into the Footer).
    const pastLastSnap = () => {
      const all = sections();
      if (!all.length) return false;
      const last = all[all.length - 1];
      const lastBottom =
        last.getBoundingClientRect().bottom + window.scrollY;
      return window.scrollY + window.innerHeight > lastBottom + 2;
    };

    const onWheel = (e: WheelEvent) => {
      if (isEditable(e.target)) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      // If the user is already scrolled into Footer, let them roam freely.
      if (pastLastSnap() && e.deltaY > 0) return;

      if (locked) {
        e.preventDefault();
        return;
      }
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = currentIndex() + dir;
      const all = sections();
      if (next < 0) return; // allow bouncing at top
      if (next >= all.length) {
        // one wheel tick past last section → scroll to Footer natively
        e.preventDefault();
        locked = true;
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        if (lockTimer) clearTimeout(lockTimer);
        lockTimer = setTimeout(() => {
          locked = false;
        }, LOCK_MS);
        return;
      }
      e.preventDefault();
      goTo(next);
    };

    let touchY = 0;
    let touchTime = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (isEditable(e.target)) return;
      touchY = e.touches[0]?.clientY ?? 0;
      touchTime = Date.now();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (locked) return;
      if (isEditable(e.target)) return;
      const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      if (Date.now() - touchTime > 800) return; // slow drag — ignore
      const dir = dy > 0 ? 1 : -1;
      const next = currentIndex() + dir;
      const all = sections();
      if (next < 0 || next >= all.length) return;
      goTo(next);
    };

    const onKey = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      if (locked) return;
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
        return;
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(sections().length - 1);
        return;
      } else return;
      const next = currentIndex() + dir;
      const all = sections();
      if (next < 0 || next >= all.length) return;
      e.preventDefault();
      goTo(next);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      if (lockTimer) clearTimeout(lockTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
