import { describe, expect, it } from "vitest";
import {
  formatPromoValue,
  promoCodeForApi,
  promoValueForApi,
} from "./promo-code";

describe("promo-code admin values", () => {
  it("converts percentage input to persisted basis points", () => {
    expect(promoValueForApi("percentage", 10)).toBe(1_000);
    expect(promoValueForApi("percentage", 12.5)).toBe(1_250);
  });

  it("does not convert a fixed-amount input", () => {
    expect(promoValueForApi("fixed", 5_000)).toBe(5_000);
  });

  it("only submits currency for fixed discounts", () => {
    expect(
      promoCodeForApi({ code: "SAVE10", type: "percentage", value: 10, currency: "AMD", active: true }),
    ).toEqual({ code: "SAVE10", type: "percentage", value: 1000, active: true });
    expect(
      promoCodeForApi({ code: "SAVE5000", type: "fixed", value: 5000, currency: "AMD", active: true }),
    ).toMatchObject({ currency: "AMD", value: 5000 });
  });

  it("formats percentage values as percentages rather than currency", () => {
    expect(formatPromoValue("percentage", 1_000, "AMD")).toBe("10%");
    expect(formatPromoValue("fixed", 5_000, "AMD")).toBe("5000 AMD");
  });
});
