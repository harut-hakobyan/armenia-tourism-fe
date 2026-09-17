import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto max-w-3xl px-5 py-24 text-center"><p className="text-sm font-bold uppercase tracking-widest text-apricot">404</p><h1 className="text-display mt-3 text-5xl">Tour not found</h1><p className="mt-5 text-ink/60">This page may have moved or is no longer available.</p><Link className="mt-8 inline-flex rounded-full bg-forest px-5 py-3 font-semibold text-white" href="/tours">Browse tours</Link></main>;
}
