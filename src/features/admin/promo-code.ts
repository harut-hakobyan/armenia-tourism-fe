import type { Currency } from "@/types/domain";

export type PromoCodeType = "percentage" | "fixed";

export interface PromoCodeDraft {
  code: string;
  type: PromoCodeType;
  value: number;
  currency: Currency;
  active: boolean;
}

export interface PromoCodeApiInput extends Omit<PromoCodeDraft, "currency"> {
  currency?: Currency;
}

/** Percentage promo values are persisted as basis points (1000 = 10%). */
export function promoValueForApi(type: PromoCodeType, value: number): number {
  return type === "percentage" ? Math.round(value * 100) : value;
}

export function promoCodeForApi(draft: PromoCodeDraft): PromoCodeApiInput {
  const { currency, ...promo } = draft;
  const input = { ...promo, value: promoValueForApi(promo.type, promo.value) };
  return promo.type === "fixed" ? { ...input, currency } : input;
}

export function formatPromoValue(
  type: string | undefined,
  value: number | undefined,
  currency: string | undefined,
): string {
  if (value === undefined) return "";
  if (type === "percentage") return `${value / 100}%`;
  return `${value}${currency ? ` ${currency}` : ""}`;
}
