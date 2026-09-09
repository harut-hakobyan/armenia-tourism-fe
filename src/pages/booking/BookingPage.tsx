import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronRight, Clock3 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NumericInput } from "@/components/ui/NumericInput";
import { carsQuery, toursQuery } from "@/features/catalog/api";
import { bookingApi } from "@/features/bookings/api";
import { bookingDraft } from "@/features/bookings/draft";
import { estimateApi } from "@/features/estimates/api";
import { selectBestVehicleType } from "@/features/estimates/vehicle-allocation";
import { carTypeCapacity, carTypes, isCarType } from "@/features/cars/types";
import { formatMoney } from "@/lib/money";
import { toApiError } from "@/lib/api-client";
import type { ServiceType } from "@/types/domain";

const today = new Date().toISOString().slice(0, 10);
const defaultRoute = [
  { latitude: 40.1473, longitude: 44.3959, label: "Zvartnots Airport" },
  { latitude: 40.1776, longitude: 44.5126, label: "Yerevan" },
];
type BookingChoice = "group_tour" | "private_tour" | "custom_trip";

function validPassengerCount(value: unknown): number {
  const count = Number(value);
  return Number.isInteger(count) && count >= 1 && count <= 255 ? count : 1;
}

export function BookingPage() {
  const { i18n, t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const draft = bookingDraft.get();
  const premium = params.get("vehicle") === "premium";
  const requestedCarType = params.get("type");
  const [selectedCarType, setSelectedCarType] = useState(
    isCarType(requestedCarType) ? requestedCarType : "sedan",
  );
  const requestedService = params.get("service") ?? draft?.service_type;
  const initialService: Extract<ServiceType, "tour" | "custom_trip"> =
    requestedService === "custom_trip" ? "custom_trip" : "tour";
  const initialChoice: BookingChoice =
    initialService === "custom_trip" ? "custom_trip" : "group_tour";
  const serviceLocked = params.has("service") || Boolean(draft?.service_type);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [bookingChoice, setBookingChoice] =
    useState<BookingChoice>(initialChoice);
  const requestedCarId = Number(params.get("car") ?? draft?.car_id ?? 0);
  const [selectedCarId, setSelectedCarId] = useState(
    Number.isInteger(requestedCarId) ? requestedCarId : 0,
  );
  const selectedPassengers = validPassengerCount(
    params.get("passengers") ??
      draft?.passengers ??
      draft?.estimate?.passengers,
  );
  const [form, setForm] = useState({
    service: initialService,
    tour: Number(params.get("tour") ?? draft?.tour_id ?? 0),
    date: "",
    time: "09:00",
    passengers: initialChoice === "group_tour" ? 1 : selectedPassengers,
    pickup: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    promoCode: draft?.promo_code ?? "",
    notes: "",
  });
  const tours = useQuery(toursQuery(i18n.language, { per_page: 50 }));
  const selectedTour = tours.data?.data.find((tour) => tour.id === form.tour);
  const effectiveBookingChoice: BookingChoice =
    serviceLocked && selectedTour
      ? selectedTour.format === "group"
        ? "group_tour"
        : "private_tour"
      : bookingChoice;
  const serviceLabel =
    effectiveBookingChoice === "group_tour"
      ? t("booking.groupTour")
      : effectiveBookingChoice === "private_tour"
        ? t("booking.privateTour")
        : t("booking.customTrip");
  const group = effectiveBookingChoice === "group_tour";
  const privateTour = effectiveBookingChoice === "private_tour";
  const cars = useQuery(
    carsQuery({
      ...(premium ? { category: "premium" as const } : {}),
      per_page: 100,
      sort: "price_asc",
    }),
  );
  const availableTypes = useMemo(
    () => new Set(cars.data?.data.map((car) => car.type) ?? []),
    [cars.data],
  );
  const effectiveCarType =
    !privateTour || !cars.data || availableTypes.has(selectedCarType)
      ? selectedCarType
      : (carTypes.find((type) => availableTypes.has(type)) ?? selectedCarType);
  const eligibleCars = (cars.data?.data ?? []).filter((car) => {
    if (group) return car.passenger_capacity >= form.passengers;
    if (privateTour) return car.type === effectiveCarType;
    return true;
  });
  const effectivePassengers = form.passengers;
  const automaticCarId =
    eligibleCars.find((car) => car.id === selectedCarId)?.id ??
    selectBestVehicleType(eligibleCars, form.passengers)?.id ??
    0;
  const selectedCar = eligibleCars.find(
    (car) => car.id === automaticCarId,
  );
  const passengerCapacityExceeded = Boolean(
    (premium || privateTour) &&
      selectedCar &&
      form.passengers > selectedCar.passenger_capacity,
  );
  const effectiveDate = form.date;
  const effectiveTime = group
    ? (selectedTour?.start_time ?? "09:00")
    : form.time;
  const effectivePickup = group
    ? (selectedTour?.meeting_point ?? "")
    : form.pickup;
  const normalizedPromoCode = form.promoCode.trim().toUpperCase();
  const promoCodeLocked = Boolean(draft?.promo_code);

  const estimate = useMutation({
    mutationFn: () => {
      const contact = {
        passengers: effectivePassengers,
        ...(form.email ? { customer_email: form.email } : {}),
        ...(normalizedPromoCode ? { promo_code: normalizedPromoCode } : {}),
      };
      if (form.service === "tour")
        return estimateApi.tour({
          ...contact,
          tour_id: form.tour,
          booking_date: effectiveDate,
          car_id: automaticCarId,
        });
      const base = { ...contact, car_id: automaticCarId };
      const route = draft?.route_points ?? defaultRoute;
      return estimateApi.customTrip({ ...base, route_points: route });
    },
  });
  const create = useMutation({ mutationFn: bookingApi.create });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function chooseTour(tourId: number) {
    setForm((current) => ({ ...current, tour: tourId, date: "" }));
  }
  function chooseService(choice: BookingChoice) {
    setBookingChoice(choice);
    setForm((current) => ({
      ...current,
      service: choice === "custom_trip" ? "custom_trip" : "tour",
      tour: 0,
      date: "",
      passengers: choice === "group_tour" ? 1 : current.passengers,
    }));
  }
  const journeyReady =
    form.service === "tour"
      ? Boolean(
          form.tour &&
          form.date &&
          automaticCarId &&
          !passengerCapacityExceeded &&
          (!group || effectivePickup),
        )
      : Boolean(form.date && automaticCarId && !passengerCapacityExceeded);

  async function review() {
    setError(null);
    if (!journeyReady) {
      setError(
        t(
          form.service === "custom_trip"
            ? "booking.chooseDate"
            : "booking.chooseTourDate",
        ),
      );
      return;
    }
    try {
      await estimate.mutateAsync();
      setStep(3);
    } catch (reason) {
      setError(toApiError(reason).message);
    }
  }

  async function submit() {
    setError(null);
    try {
      const routeService = form.service === "custom_trip";
      const result = await create.mutateAsync({
        idempotency_key: crypto.randomUUID(),
        service_type: form.service,
        ...(form.tour ? { tour_id: form.tour } : {}),
        car_id: automaticCarId,
        booking_date: effectiveDate,
        pickup_time: effectiveTime,
        passengers: effectivePassengers,
        pickup_address: effectivePickup,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        ...(form.whatsapp ? { customer_whatsapp: form.whatsapp } : {}),
        ...(form.notes ? { customer_notes: form.notes } : {}),
        ...(normalizedPromoCode ? { promo_code: normalizedPromoCode } : {}),
        payment_method: "pay_driver",
        ...(routeService
          ? { route_points: draft?.route_points ?? defaultRoute }
          : {}),
        ...(draft?.dropoff_address
          ? { dropoff_address: draft.dropoff_address }
          : {}),
        ...(draft?.service_options || premium
          ? {
              service_options: {
                ...(draft?.service_options ?? {}),
                ...(premium ? { vehicle_class: "premium" } : {}),
              },
            }
          : {}),
      });
      bookingDraft.clear();
      void navigate("/booking/confirmation", { state: { booking: result } });
    } catch (reason) {
      setError(toApiError(reason).message);
    }
  }

  const labels = [
    t("booking.steps.journey"),
    t("booking.steps.contact"),
    t("booking.steps.review"),
  ];
  return (
    <Container className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">
          {t("booking.secure")}
        </p>
        <h1 className="text-display mt-2 text-5xl">{t("booking.title")}</h1>
        <div
          aria-label={t("booking.progress", { step, total: labels.length })}
          className="mt-8 flex items-center rounded-2xl border border-black/6 bg-white p-2 shadow-[0_10px_35px_rgb(23_35_29/0.06)] sm:p-3"
        >
          {labels.map((label, index) => {
            const number = index + 1;
            const complete = step > number;
            const active = step === number;
            return (
              <div key={label} className="contents">
                <div
                  aria-current={active ? "step" : undefined}
                  className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2.5 transition sm:gap-3 sm:px-4 ${active ? "bg-forest text-white shadow-md shadow-forest/15" : complete ? "text-forest" : "text-ink/40"}`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-extrabold sm:size-8 ${active ? "bg-white text-forest" : complete ? "bg-forest text-white" : "bg-stone text-ink/45"}`}
                  >
                    {complete ? <Check className="size-4" /> : number}
                  </span>
                  <span className="truncate text-xs font-bold sm:text-sm">
                    {label}
                  </span>
                </div>
                {index < labels.length - 1 && (
                  <ChevronRight
                    aria-hidden="true"
                    className={`mx-0.5 size-4 shrink-0 sm:mx-2 sm:size-5 ${complete ? "text-forest" : "text-ink/20"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft sm:p-8">
          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              {serviceLocked ? (
                <div className="rounded-2xl bg-stone p-4 text-sm sm:col-span-2">
                  <strong>{t("booking.service")}:</strong> {serviceLabel}
                </div>
              ) : (
                <label className="text-sm font-semibold sm:col-span-2">
                  {t("booking.service")}
                  <select
                    value={effectiveBookingChoice}
                    onChange={(e) =>
                      chooseService(e.target.value as BookingChoice)
                    }
                    className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"
                  >
                    <option value="group_tour">{t("booking.groupTour")}</option>
                    <option value="private_tour">
                      {t("booking.privateTour")}
                    </option>
                    <option value="custom_trip">
                      {t("booking.customTrip")}
                    </option>
                  </select>
                </label>
              )}
              {form.service === "tour" && (
                <label className="text-sm font-semibold sm:col-span-2">
                  {t("booking.tour")}
                  <select
                    value={form.tour}
                    onChange={(e) => chooseTour(Number(e.target.value))}
                    className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"
                  >
                    <option value="0">{t("booking.chooseTour")}</option>
                    {tours.data?.data
                      .filter(
                        (tour) => tour.format === (group ? "group" : "private"),
                      )
                      .map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {tour.title}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              {privateTour && (
                <label className="text-sm font-semibold sm:col-span-2">
                  {t("booking.transport")}
                  <select
                    value={effectiveCarType}
                    onChange={(event) => {
                      setSelectedCarType(
                        event.target.value as typeof selectedCarType,
                      );
                      setSelectedCarId(0);
                    }}
                    className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 capitalize"
                  >
                    {carTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        disabled={Boolean(cars.data && !availableTypes.has(type))}
                      >
                        {type} · {carTypeCapacity[type]} {t("common.guests")}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label
                className={`min-w-0 text-sm font-semibold ${group ? "sm:col-span-2" : ""}`}
              >
                {t("booking.date")}
                <span className="group mt-2 flex h-12 w-full items-center rounded-xl border border-black/10 bg-white px-4 shadow-[0_1px_2px_rgb(23_35_29/0.04)] transition hover:border-forest/35 focus-within:border-forest-light focus-within:ring-4 focus-within:ring-forest-light/10">
                  <CalendarDays
                    aria-hidden="true"
                    className="mr-3 size-5 shrink-0 text-forest/55 transition group-focus-within:text-forest"
                  />
                  <input
                    aria-label={t("booking.date")}
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-medium text-ink outline-none [color-scheme:light] focus-visible:outline-none"
                  />
                </span>
              </label>
              {!group && (
                <>
                  <label className="min-w-0 text-sm font-semibold">
                    {t("booking.pickupTime")}
                    <span className="group mt-2 flex h-12 w-full items-center rounded-xl border border-black/10 bg-white px-4 shadow-[0_1px_2px_rgb(23_35_29/0.04)] transition hover:border-forest/35 focus-within:border-forest-light focus-within:ring-4 focus-within:ring-forest-light/10">
                      <Clock3
                        aria-hidden="true"
                        className="mr-3 size-5 shrink-0 text-forest/55 transition group-focus-within:text-forest"
                      />
                      <input
                        aria-label={t("booking.pickupTime")}
                        type="time"
                        value={form.time}
                        onChange={(e) => update("time", e.target.value)}
                        className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-medium text-ink outline-none [color-scheme:light] focus-visible:outline-none"
                      />
                    </span>
                  </label>
                </>
              )}
              {!group && premium && (
                <label className="text-sm font-semibold sm:col-span-2">
                  {t("customTrip.selectPremiumCar")}
                  <select
                    value={automaticCarId || ""}
                    onChange={(event) => {
                      const carId = Number(event.target.value);
                      setSelectedCarId(carId);
                    }}
                    className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-4"
                  >
                    {eligibleCars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.name} · {car.passenger_capacity}{" "}
                        {t("common.guests")}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {group || premium || privateTour ? (
                <label className="text-sm font-semibold sm:col-span-2">
                  {t("booking.passengers")}
                  <NumericInput
                    required
                    min={1}
                    max={
                      group
                        ? Math.min(selectedTour?.max_passengers ?? 20, 20)
                        : privateTour
                          ? Math.min(
                              carTypeCapacity[effectiveCarType],
                              selectedTour?.max_passengers ?? 255,
                            )
                        : (selectedCar?.passenger_capacity ?? 255)
                    }
                    value={effectivePassengers}
                    onValueChange={(value) => {
                      if (value !== null) update("passengers", value);
                    }}
                    className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"
                  />
                </label>
              ) : (
                <div className="rounded-2xl bg-stone p-4 text-sm sm:col-span-2">
                  <strong>{t("booking.passengers")}:</strong> {form.passengers}
                </div>
              )}
              {passengerCapacityExceeded && selectedCar && (
                <p className="text-sm text-danger sm:col-span-2">
                  {t("customTrip.passengerCapacityExceeded", {
                    count: selectedCar.passenger_capacity,
                  })}
                </p>
              )}
              {!group && !premium && !privateTour ? (
                <div className="rounded-2xl bg-stone p-4 text-sm sm:col-span-2">
                  <strong>{t("booking.transport")}</strong>{" "}
                  {t("booking.automaticVehicle")}
                </div>
              ) : null}
              {group && selectedTour && (
                <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                  <div className="rounded-2xl bg-stone p-4 text-sm">
                    <strong>{t("booking.startTime")}</strong> {effectiveTime}
                  </div>
                  <div className="rounded-2xl bg-stone p-4 text-sm">
                    <strong>{t("booking.meetingPlace")}</strong>{" "}
                    {effectivePickup || t("common.toBeConfirmed")}
                  </div>
                </div>
              )}
              <Button
                onClick={() => setStep(2)}
                disabled={!journeyReady}
                className="sm:col-span-2"
              >
                {t("booking.continue")}
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {t(group ? "booking.meetingPoint" : "booking.pickupAddress")}
                <input
                  value={effectivePickup}
                  readOnly={group}
                  onChange={(e) => update("pickup", e.target.value)}
                  placeholder={t("booking.addressPlaceholder")}
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4 read-only:bg-stone"
                />
              </label>
              <label className="text-sm font-semibold">
                {t("booking.fullName")}
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"
                />
              </label>
              <label className="text-sm font-semibold">
                {t("booking.phone")}
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"
                />
              </label>
              <label className="text-sm font-semibold">
                {t("booking.email")}
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"
                />
              </label>
              <label className="text-sm font-semibold">
                {t("booking.whatsapp")}
                <input
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4"
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {t("booking.promoCode")}
                <input
                  value={form.promoCode}
                  onChange={(e) => update("promoCode", e.target.value.toUpperCase())}
                  placeholder={t("booking.promoPlaceholder")}
                  autoComplete="off"
                  disabled={promoCodeLocked}
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/10 px-4 uppercase disabled:cursor-not-allowed disabled:bg-stone disabled:text-ink/55"
                />
                {promoCodeLocked && (
                  <span className="mt-2 block text-xs font-normal text-emerald-700">
                    {t("booking.promoApplied")}
                  </span>
                )}
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {t("booking.notes")}
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-black/10 p-4"
                />
              </label>
              <div className="flex gap-3 sm:col-span-2">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  {t("booking.back")}
                </Button>
                <Button
                  onClick={() => void review()}
                  disabled={
                    !effectivePickup ||
                    !form.name ||
                    !form.phone ||
                    !form.email.trim() ||
                    estimate.isPending
                  }
                  className="flex-1"
                >
                  {estimate.isPending
                    ? t("booking.checkingPrice")
                    : t("booking.reviewBooking")}
                </Button>
              </div>
            </div>
          )}
          {step === 3 && estimate.data && (
            <div>
              <h2 className="text-display text-3xl">{t("booking.summary")}</h2>
              <dl className="mt-6 grid gap-4 rounded-2xl bg-stone p-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-ink/45">
                    {t("booking.service")}
                  </dt>
                  <dd className="mt-1 font-semibold">{serviceLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-ink/45">
                    {t("booking.dateTime")}
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {effectiveDate} · {effectiveTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-ink/45">
                    {t("booking.passengers")}
                  </dt>
                  <dd className="mt-1 font-semibold">{effectivePassengers}</dd>
                </div>
                {!group && (
                  <div>
                    <dt className="text-xs uppercase text-ink/45">
                      {t("booking.transport")}
                    </dt>
                    <dd className="mt-1 font-semibold capitalize">
                      {estimate.data.car.type}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase text-ink/45">
                    {t(group ? "booking.meetingPlace" : "booking.pickup")}
                  </dt>
                  <dd className="mt-1 font-semibold">{effectivePickup}</dd>
                </div>
                {estimate.data.price.promo_code && (
                  <div>
                    <dt className="text-xs uppercase text-ink/45">
                      {t("booking.promoCode")}
                    </dt>
                    <dd className="mt-1 font-semibold text-forest">
                      {estimate.data.price.promo_code}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-6 flex items-end justify-between border-t border-black/8 pt-6">
                <div>
                  <p className="text-sm text-ink/50">
                    {t(group ? "booking.totalPassengers" : "booking.totalCar")}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-forest">
                    {formatMoney(
                      estimate.data.price.total_minor,
                      estimate.data.price.currency,
                    )}
                  </p>
                  {estimate.data.price.discount_minor > 0 && (
                    <p className="mt-1 text-sm font-semibold text-emerald-700">
                      {t("booking.discount")}: -{formatMoney(
                        estimate.data.price.discount_minor,
                        estimate.data.price.currency,
                      )}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-stone px-3 py-1 text-xs font-bold">
                  {t("booking.payDriver")}
                </span>
              </div>
              <div className="mt-7 flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  {t("booking.back")}
                </Button>
                <Button
                  onClick={() => void submit()}
                  disabled={create.isPending}
                  className="flex-1"
                >
                  {create.isPending
                    ? t("booking.confirming")
                    : t("booking.confirm")}
                </Button>
              </div>
            </div>
          )}
          {error && (
            <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
