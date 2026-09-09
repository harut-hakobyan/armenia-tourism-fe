import {
  CalendarDays,
  CarFront,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QrTicket } from "@/components/booking/QrTicket";
import { Container } from "@/components/ui/Container";
import { PageLoader } from "@/components/ui/PageLoader";
import { QueryError } from "@/components/ui/QueryState";
import { bookingApi } from "@/features/bookings/api";
import { contentApi } from "@/features/content/api";
import { formatMoney } from "@/lib/money";

export function BookingStatusPage() {
  const { i18n, t } = useTranslation();
  const { bookingNumber = "", token = "" } = useParams();
  const query = useQuery({
    queryKey: ["booking", bookingNumber, token, i18n.language],
    queryFn: () => bookingApi.findPublic(bookingNumber, token),
    retry: false,
  });
  const settings = useQuery({
    queryKey: ["public-settings"],
    queryFn: contentApi.settings,
  });
  if (query.isPending) return <PageLoader />;
  if (query.isError)
    return (
      <Container className="py-20">
        <QueryError retry={() => void query.refetch()} />
      </Container>
    );
  const booking = query.data;
  const attendance = booking.attendance;
  const qrPayload = booking.qr_payload;
  const premiumCar =
    booking.car?.category === "premium" ? booking.car : null;
  const phone = settings.data?.company_phone?.trim() ?? "";
  const email = settings.data?.company_email?.trim() ?? "";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappDigits = (
    settings.data?.whatsapp_number?.trim() || phone
  ).replace(/\D/g, "");
  const telegramLink = getTelegramLink(
    settings.data?.telegram?.trim(),
    phoneDigits,
  );

  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider text-apricot">
              {booking.booking_number}
            </p>
            <h1 className="text-display mt-2 text-5xl">
              {t("booking.yourBooking")}
            </h1>
          </div>
          <span className="rounded-full bg-forest px-4 py-2 text-sm font-bold capitalize text-white">
            {t(`booking.statuses.${booking.booking_status}`)}
          </span>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <Info
            icon={CalendarDays}
            label={t("booking.dateTime")}
            value={`${booking.booking_date} · ${booking.pickup_time.slice(0, 5)}`}
          />
          <Info
            icon={CarFront}
            label={t("common.car")}
            value={premiumCar?.name ?? t("booking.automaticVehicle")}
          />
          <Info
            icon={MapPin}
            label={t("booking.pickup")}
            value={booking.pickup.address}
          />
          {attendance && (
            <Info
              icon={Users}
              label={t("booking.attendance")}
              value={t("booking.checkedInCount", {
                checked: attendance.checked_in_passengers,
                total: booking.passengers,
              })}
            />
          )}
          {booking.price.breakdown.promo_code && (
            <Info
              icon={Tag}
              label={t("booking.promoCode")}
              value={booking.price.breakdown.promo_code}
            />
          )}
          {(phone || email) && (
            <section className="rounded-2xl bg-white p-5 shadow-sm sm:col-span-2">
              <Phone className="size-5 text-apricot" />
              <h2 className="mt-3 text-xs uppercase text-ink/40">
                {t("actions.contact")}
              </h2>
              {phone && (
                <p className="mt-1 text-lg font-semibold">{phone}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {phone && (
                  <ContactLink href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
                    <Phone className="size-4" />
                    {t("booking.phone")}
                  </ContactLink>
                )}
                {whatsappDigits && (
                  <ContactLink href={`https://wa.me/${whatsappDigits}`} external>
                    <MessageCircle className="size-4" />
                    {t("booking.whatsapp")}
                  </ContactLink>
                )}
                {phone && (
                  <ContactLink
                    href={`viber://chat?number=${encodeURIComponent(phone.replace(/[^+\d]/g, ""))}`}
                  >
                    <MessageCircle className="size-4" />
                    Viber
                  </ContactLink>
                )}
                {telegramLink && (
                  <ContactLink href={telegramLink} external>
                    <Send className="size-4" />
                    Telegram
                  </ContactLink>
                )}
                {email && (
                  <ContactLink href={`mailto:${email}`}>
                    <Mail className="size-4" />
                    {t("booking.email")}
                  </ContactLink>
                )}
              </div>
            </section>
          )}
        </div>
        {qrPayload && attendance ? (
          <div className="mt-6">
            <QrTicket
              bookingNumber={booking.booking_number}
              payload={qrPayload}
              status={attendance.status}
            />
          </div>
        ) : (
          <p className="mt-6 rounded-2xl bg-amber-50 p-5 text-center text-sm text-amber-900">
            {t("booking.qrWaiting")}
          </p>
        )}
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-ink/50">{t("booking.total")}</p>
              <p className="mt-1 text-3xl font-bold text-forest">
                {formatMoney(booking.price.total_minor, booking.price.currency)}
              </p>
              {booking.price.discount_minor > 0 && (
                <p className="mt-1 text-sm font-semibold text-emerald-700">
                  {t("booking.discount")}: -{formatMoney(
                    booking.price.discount_minor,
                    booking.price.currency,
                  )}
                </p>
              )}
            </div>
            <div className="text-right text-sm text-ink/55">
              <p>
                {t("booking.paid")}:{" "}
                {formatMoney(
                  booking.price.deposit_amount_minor,
                  booking.price.currency,
                )}
              </p>
              <p>
                {t("booking.remaining")}:{" "}
                {formatMoney(
                  booking.price.total_minor -
                    booking.price.deposit_amount_minor,
                  booking.price.currency,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

function ContactLink({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-forest/15 px-4 text-sm font-semibold text-forest transition hover:border-forest/35 hover:bg-stone"
    >
      {children}
    </a>
  );
}

function getTelegramLink(
  configured: string | undefined,
  fallbackPhoneDigits: string,
): string | undefined {
  if (!configured) {
    return fallbackPhoneDigits
      ? `https://t.me/+${fallbackPhoneDigits}`
      : undefined;
  }

  if (/^https?:\/\//i.test(configured)) return configured;

  return `https://t.me/${configured.replace(/^@/, "")}`;
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <Icon className="size-5 text-apricot" />
      <p className="mt-3 text-xs uppercase text-ink/40">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
