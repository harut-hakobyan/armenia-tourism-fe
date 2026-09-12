import { describe, expect, it } from "vitest";
import type { Car } from "@/types/domain";
import { selectBestVehicleType } from "./vehicle-allocation";

function car(id: number, capacity: number, pricePerKilometreMinor: number): Car {
  return {
    id,
    name: `Test Vehicle ${id}`,
    brand: "Test",
    model: `Vehicle ${id}`,
    year: 2026,
    color: "White",
    category: id === 1 ? "economy" : id === 2 ? "minivan" : "bus",
    type:
      capacity <= 3
        ? "premier"
        : capacity <= 4
          ? "sedan"
          : capacity <= 6
            ? "minivan"
            : capacity <= 10
              ? "minibus"
              : "bus",
    passenger_capacity: capacity,
    luggage_capacity: 0,
    transmission: "automatic",
    features: {
      air_conditioning: true,
      wifi: false,
      child_seat_available: false,
    },
    rates: {
      base_minor: 0,
      per_km_minor: pricePerKilometreMinor,
      per_hour_minor: 0,
      currency: "AMD",
    },
    cover_image: null,
    gallery: [],
  };
}

describe("selectBestVehicleType", () => {
  const cars = [car(1, 4, 5_000), car(2, 6, 10_000), car(3, 20, 20_000)];

  it("uses one suitable vehicle instead of multiple smaller vehicles", () => {
    expect(selectBestVehicleType(cars, 6)?.id).toBe(2);
  });

  it("minimizes vehicle count for large groups", () => {
    expect(selectBestVehicleType(cars, 80)?.id).toBe(3);
  });

  it("uses the per-kilometre rate when vehicle counts are equal", () => {
    expect(selectBestVehicleType([car(4, 3, 90), car(5, 4, 70)], 3)?.id).toBe(5);
  });
});
