import type { Metadata } from "next";
import { AboutPage } from "../../components/legacy/PublicPages";
import { pageMetadata } from "../../lib/i18n/page-metadata";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("about");

export default function Page() {
  return <AboutPage />;
}
