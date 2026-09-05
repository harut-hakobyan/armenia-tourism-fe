import { useState } from "react";
import { Check, Clock3, MapPin, Route, UsersRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "@/components/ui/Container";
import { PageLoader } from "@/components/ui/PageLoader";
import { QueryError } from "@/components/ui/QueryState";
import { buttonStyles } from "@/components/ui/button-styles";
import { tourQuery } from "@/features/catalog/api";
import { formatMoney } from "@/lib/money";
import type { Tour } from "@/types/domain";

function TourHeroMedia({ item }: { item: Tour }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const image = (
    <img
      src={item.cover_image?.url ?? "/images/armenia-garni-hero.png"}
      alt={item.cover_image?.alt_text ?? item.title}
      className="absolute inset-0 size-full object-cover"
    />
  );

  if (!item.video || videoFailed) return image;

  return (
    <>
      {image}
      <video
        key={item.video.id}
        src={item.video.url}
        poster={item.cover_image?.url}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        onError={() => setVideoFailed(true)}
        className="absolute inset-0 size-full object-cover"
      />
    </>
  );
}

function TourDescription({ description }: { description: string | null }) {
  if (!description) return null;

  return (
    <div className="mt-5 space-y-3 leading-8 text-ink/65">
      {description.split(/\r\n|\r|\n/).map((line, index) => {
        const content = line.trim();
        if (!content)
          return <div key={index} aria-hidden="true" className="h-3" />;
        const heading =
          /^\d+\.\s/.test(content) ||
          /^\p{Extended_Pictographic}/u.test(content);
        return heading ? (
          <h3 key={index} className="text-lg font-bold text-ink">
            {content}
          </h3>
        ) : (
          <p key={index}>{content}</p>
        );
      })}
    </div>
  );
}

export function TourDetailsPage() {
  const { slug = "" } = useParams();
  const { i18n, t } = useTranslation();
  const tour = useQuery(tourQuery(i18n.language, slug));

  if (tour.isPending) return <PageLoader />;
  if (tour.isError)
    return (
      <Container className="py-20">
        <QueryError retry={() => void tour.refetch()} />
      </Container>
    );

  const item = tour.data;
  const group = item.format === "group";

  return (
    <>
      <section className="relative min-h-[520px] overflow-hidden bg-ink text-white">
        <TourHeroMedia key={item.id} item={item} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
        <Container className="relative flex min-h-[520px] items-end py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-apricot-light">
              {item.category?.name} ·{" "}
              {t(
                group
                  ? "tourDetails.smallGroupTour"
                  : "tourDetails.privateTour",
              )}
            </p>
            <h1 className="text-display mt-3 text-5xl sm:text-7xl">
              {item.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/75">
              {item.short_description}
            </p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold">
              <span className="flex gap-2">
                <Clock3 />
                {Math.round(item.duration_minutes / 60)} {t("common.hours")}
              </span>
              <span className="flex gap-2">
                <Route />
                {item.approximate_distance_km} km
              </span>
              <span className="flex gap-2">
                {group ? <UsersRound /> : <Check />}
                {t(
                  group ? "tourDetails.sharedGroup" : "tourDetails.privateCar",
                )}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-display text-4xl">{t("tourDetails.journey")}</h2>
          <TourDescription description={item.description} />
          <h2 className="text-display mt-14 text-4xl">
            {t("tourDetails.itinerary")}
          </h2>
          <div className="mt-8 space-y-0">
            {item.itinerary?.map((stop, index) => (
              <div
                className="relative flex gap-5 pb-8"
                key={`${stop.day_number}-${stop.stop_order}`}
              >
                <div className="flex flex-col items-center">
                  <span className="grid size-10 place-items-center rounded-full bg-forest text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  {index < (item.itinerary?.length ?? 0) - 1 && (
                    <span className="h-full w-px bg-sand" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="font-bold">
                    {stop.destination?.name ?? t("tourDetails.scenicStop")}
                  </h3>
                  {stop.duration_minutes && (
                    <p className="mt-1 text-sm text-ink/50">
                      {t("tourDetails.duration", {
                        count: stop.duration_minutes,
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {item.gallery.length > 0 && (
            <section className="mt-14">
              <h2 className="text-display text-4xl">
                {t("tourDetails.gallery")}
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {item.gallery.map((image, index) => (
                  <figure
                    key={image.id}
                    className={`overflow-hidden rounded-3xl bg-stone ${index === 0 && item.gallery.length > 2 ? "sm:col-span-2" : ""}`}
                  >
                    <img
                      src={image.url}
                      alt={
                        image.alt_text ??
                        `${item.title} ${t("tourDetails.gallery")} ${index + 1}`
                      }
                      loading="lazy"
                      className={`w-full object-cover transition duration-500 hover:scale-[1.02] ${index === 0 && item.gallery.length > 2 ? "aspect-[16/8]" : "aspect-[4/3]"}`}
                    />
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-sm text-ink/50">
              {t(group ? "tourDetails.groupFrom" : "tourDetails.privateFrom")}
            </p>
            <p className="mt-1 text-3xl font-bold text-forest">
              {formatMoney(
                item.starting_price.amount_minor,
                item.starting_price.currency,
                i18n.language,
              )}{" "}
              <span className="text-sm font-normal text-ink/50">
                / {t(group ? "common.person" : "common.car")}
              </span>
            </p>
            {group ? (
              <div className="mt-6">
                <h2 className="font-bold">{t("tourDetails.schedule")}</h2>
                <div className="mt-3 space-y-3 rounded-2xl border border-black/8 p-4">
                  <p className="flex items-center gap-2 text-sm">
                    <Clock3 className="size-4 text-apricot" />
                    <strong>{t("tourDetails.startTime")}</strong>{" "}
                    {item.start_time ?? t("common.toBeConfirmed")}
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-apricot" />
                    <span>
                      <strong>{t("tourDetails.meetingPlace")}</strong>{" "}
                      {item.meeting_point ?? t("common.toBeConfirmed")}
                    </span>
                  </p>
                </div>
                <Link
                  to={`/booking?service=tour&tour=${item.id}`}
                  className={`${buttonStyles()} mt-5 w-full`}
                >
                  {t("tourDetails.bookGroup")}
                </Link>
              </div>
            ) : (
              <>
                <ul className="mt-6 space-y-3 text-sm text-ink/65">
                  <li className="flex gap-2">
                    <MapPin className="size-4 text-apricot" />
                    {t("tourDetails.hotelPickup")}
                  </li>
                  <li className="flex gap-2">
                    <Check className="size-4 text-apricot" />
                    {t("tourDetails.freeCancellation", {
                      count: item.free_cancellation_hours,
                    })}
                  </li>
                </ul>
                <Link
                  to={`/booking?service=tour&tour=${item.id}`}
                  className={`${buttonStyles()} mt-7 w-full`}
                >
                  {t("tourDetails.chooseDate")}
                </Link>
              </>
            )}
          </div>
        </aside>
      </Container>
    </>
  );
}
