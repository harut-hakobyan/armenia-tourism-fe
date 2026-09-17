import Image from "next/image";
import Link from "next/link";
import { Clock3, Route } from "lucide-react";
import type { Tour } from "../../../src/types/domain";
import { formatMoney } from "../../../src/lib/money";

export function TourCard({ tour, premium = false }: { tour: Tour; premium?: boolean }) {
  const image = tour.cover_image?.url ?? "/images/armenia-garni-hero.png";
  const href = `/tours/${encodeURIComponent(tour.slug)}${premium ? "?vehicle=premium" : ""}`;
  return <article className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"><Link href={href}><div className="relative aspect-[4/3] overflow-hidden bg-stone"><Image src={image} alt={tour.cover_image?.alt_text || tour.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-105" unoptimized={image.startsWith("http")}/></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-apricot">{tour.category?.name || "Armenia tour"} · {tour.format}</p><h2 className="text-display mt-2 text-2xl text-forest">{tour.title}</h2>{tour.short_description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">{tour.short_description}</p>}<div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-ink/55"><span className="flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden/>{Math.round(tour.duration_minutes / 60)} hours</span>{tour.approximate_distance_km !== null && <span className="flex items-center gap-1.5"><Route className="size-4" aria-hidden/>{tour.approximate_distance_km} km</span>}</div><p className="mt-5 font-bold text-forest">From {formatMoney(tour.starting_price.amount_minor, tour.starting_price.currency, "en")}</p></div></Link></article>;
}
