import { useEffect, useId, useRef } from "react";
import {
  BriefcaseBusiness,
  CarFront,
  Check,
  Crown,
  UsersRound,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { Car } from "@/types/domain";

interface PremierCarModalProps {
  open: boolean;
  cars: Car[];
  selectedCarId: number;
  loading?: boolean;
  error?: boolean;
  onSelect: (car: Car) => void;
  onClose: () => void;
  onRetry?: () => void;
}

interface PremierCarSelectionProps {
  car: Car | undefined;
  onOpen: () => void;
  nameOnly?: boolean;
}

export function PremierCarSelection({
  car,
  onOpen,
  nameOnly = false,
}: PremierCarSelectionProps) {
  const { t } = useTranslation();

  if (!car) {
    return (
      <div className="rounded-2xl border border-dashed border-forest/25 bg-stone/55 p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest text-[#f1dfb9]">
            <Crown className="size-5" />
          </span>
          <p className="text-sm text-ink/60">{t("premierCars.description")}</p>
        </div>
        <Button className="mt-4 w-full" variant="secondary" onClick={onOpen}>
          {t("premierCars.choose")}
        </Button>
      </div>
    );
  }

  if (nameOnly) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-forest/15 bg-stone/45 px-4 py-3">
        <p className="min-w-0 truncate font-semibold">{car.name}</p>
        <Button className="shrink-0" variant="ghost" onClick={onOpen}>
          {t("premierCars.change")}
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-forest/15 bg-stone/45 sm:flex sm:items-center">
      <div className="relative h-36 bg-stone sm:h-28 sm:w-40 sm:shrink-0">
        {car.cover_image ? (
          <img
            src={car.cover_image.url}
            alt={car.cover_image.alt_text ?? car.name}
            className="size-full object-cover"
          />
        ) : (
          <CarFront className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-forest/25" />
        )}
      </div>
      <div className="min-w-0 flex-1 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-apricot">
          {t("premierCars.selected")}
        </p>
        <p className="mt-1 truncate font-bold">{car.name}</p>
        <p className="mt-1 text-xs text-ink/50">
          {car.passenger_capacity} {t("common.guests")} · {car.luggage_capacity}{" "}
          {t("common.bags")}
        </p>
      </div>
      <Button
        className="mx-4 mb-4 shrink-0 sm:mb-0"
        variant="ghost"
        onClick={onOpen}
      >
        {t("premierCars.change")}
      </Button>
    </div>
  );
}

export function PremierCarModal({
  open,
  cars,
  selectedCarId,
  loading = false,
  error = false,
  onSelect,
  onClose,
  onRetry,
}: PremierCarModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/75 px-4 py-6 backdrop-blur-sm sm:py-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-mist shadow-2xl"
      >
        <header className="flex items-start justify-between gap-5 bg-forest px-6 py-6 text-white sm:px-8">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#f1dfb9]">
              <Crown className="size-4" /> Premier
            </p>
            <h2 id={titleId} className="text-display mt-2 text-3xl sm:text-4xl">
              {t("premierCars.title")}
            </h2>
            <p className="mt-2 text-sm text-white/65">
              {t("premierCars.description")}
            </p>
          </div>
          <button
            ref={closeButton}
            type="button"
            aria-label={t("premierCars.close")}
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-8">
          {loading ? (
            <div
              aria-label={t("common.loading")}
              className="grid gap-5 sm:grid-cols-2"
            >
              {[0, 1].map((item) => (
                <div key={item} className="h-72 animate-pulse rounded-2xl bg-stone" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white p-8 text-center">
              <p className="text-sm text-danger">{t("common.error")}</p>
              {onRetry && (
                <Button className="mt-4" variant="secondary" onClick={onRetry}>
                  {t("common.retry")}
                </Button>
              )}
            </div>
          ) : cars.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-sm text-ink/55">
              <CarFront className="mx-auto mb-3 size-8 text-forest/45" />
              {t("premierCars.unavailable")}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {cars.map((car) => {
                const selected = car.id === selectedCarId;

                return (
                  <article
                    key={car.id}
                    className={`overflow-hidden rounded-2xl border bg-white transition ${selected ? "border-forest ring-2 ring-forest/15" : "border-black/8 hover:-translate-y-0.5 hover:shadow-soft"}`}
                  >
                    <div className="relative aspect-[16/9] bg-stone">
                      {car.cover_image ? (
                        <img
                          src={car.cover_image.url}
                          alt={car.cover_image.alt_text ?? car.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <CarFront className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-forest/25" />
                      )}
                      {selected && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                          <Check className="size-3.5" /> {t("premierCars.chosen")}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-apricot">
                        {car.year} · {car.color}
                      </p>
                      <h3 className="text-display mt-1 text-2xl text-ink">{car.name}</h3>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink/55">
                        <span className="inline-flex items-center gap-1.5">
                          <UsersRound className="size-4 text-forest" />
                          {car.passenger_capacity} {t("common.guests")}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <BriefcaseBusiness className="size-4 text-forest" />
                          {car.luggage_capacity} {t("common.bags")}
                        </span>
                      </div>
                      <Button
                        className="mt-5 w-full"
                        variant={selected ? "secondary" : "primary"}
                        onClick={() => onSelect(car)}
                      >
                        {selected
                          ? t("premierCars.chosen")
                          : t("premierCars.chooseThis")}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
