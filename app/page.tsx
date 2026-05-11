import { cookies } from "next/headers";
import Nav from "@/components/Nav";
import SnapScrollController from "@/components/SnapScrollController";
import Hero from "@/components/Hero";
import Problem from "@/components/sections/Problem";
import Loop from "@/components/sections/Loop";
import Gallery from "@/components/sections/Gallery";
import HuntPreview from "@/components/sections/HuntPreview";
import Packages from "@/components/sections/Packages";
import FAQ from "@/components/sections/FAQ";
import Waitlist from "@/components/sections/Waitlist";
import Footer from "@/components/Footer";
import { getDict, parseLocale } from "@/lib/i18n";
import { getHuntItems } from "@/lib/hunt";

export default async function Home() {
  const store = await cookies();
  const locale = parseLocale(store.get("locale")?.value);
  const dict = getDict(locale);
  const huntItems = getHuntItems(locale);

  return (
    <>
      <Nav locale={locale} dict={dict.nav} switcherDict={dict.localeSwitch} />
      <SnapScrollController />
      <main>
        <Hero dict={dict.hero} />
        <Problem dict={dict.problem} />
        <Loop dict={dict.loop} />
        <Gallery dict={dict.gallery} />
        <HuntPreview dict={dict.hunt} items={huntItems} />
        <Packages dict={dict.packages} />
        <FAQ dict={dict.faq} />
        <Waitlist dict={dict.waitlist} locale={locale} />
      </main>
      <Footer dict={dict.footer} />
    </>
  );
}
