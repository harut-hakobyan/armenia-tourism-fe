import Link from "next/link";
import type { PaginatedResponse } from "../../../src/types/api";
import type { Tour } from "../../../src/types/domain";
import { TourCard } from "./TourCard";

export function TourGrid({ result, pageHref, premium = false }: { result: PaginatedResponse<Tour>; pageHref: (page: number) => string; premium?: boolean }) {
  return <><div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{result.data.map((tour) => <TourCard key={tour.id} tour={tour} premium={premium}/>)}</div>{result.meta.last_page > 1 && <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Tour pages">{result.meta.current_page > 1 && <Link className="rounded-full border border-forest/20 px-5 py-2 text-sm font-semibold" href={pageHref(result.meta.current_page - 1)}>Previous</Link>}<span className="px-3 text-sm text-ink/55">Page {result.meta.current_page} of {result.meta.last_page}</span>{result.meta.current_page < result.meta.last_page && <Link className="rounded-full border border-forest/20 px-5 py-2 text-sm font-semibold" href={pageHref(result.meta.current_page + 1)}>Next</Link>}</nav>}</>;
}
