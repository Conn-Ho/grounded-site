import { cookies } from "next/headers";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HuntPreview from "@/components/sections/HuntPreview";
import { getDict, parseLocale } from "@/lib/i18n";
import { getHuntItems } from "@/lib/hunt";

export default async function HuntPage() {
  const store = await cookies();
  const locale = parseLocale(store.get("locale")?.value);
  const dict = getDict(locale);
  const huntItems = getHuntItems(locale);

  return (
    <>
      <Nav locale={locale} dict={dict.nav} switcherDict={dict.localeSwitch} />
      <main className="pt-20">
        <HuntPreview dict={dict.hunt} items={huntItems} variant="page" />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
