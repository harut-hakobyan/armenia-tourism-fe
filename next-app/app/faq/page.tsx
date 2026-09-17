import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { FaqPage } from "../../components/legacy/PublicPages";
import { QueryHydration } from "../../components/QueryHydration";
import { getEnglishFaqs, getServerLocale } from "../../lib/api/server";
import { pageMetadata } from "../../lib/i18n/page-metadata";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("faq");

export default async function Page() {
  const locale = await getServerLocale();
  const faqs = await getEnglishFaqs();
  const queryClient = new QueryClient();
  queryClient.setQueryData(["faqs", locale], faqs);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
  return <QueryHydration state={dehydrate(queryClient)}><FaqPage /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></QueryHydration>;
}
