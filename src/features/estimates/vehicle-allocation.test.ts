import { describe, expect, it } from "vitest";
import type { Car } from "@/types/domain";
import { selectBestVehicleCategory } from "./vehicle-allocation";

function car(id: number, capacity: number, baseMinor: number): Car {
  return {
    id,
    name: `Test Vehicle ${id}`,
    brand: "Test",
    model: `Vehicle ${id}`,
    year: 2026,
    color: "White",
    category: id === 1 ? "economy" : id === 2 ? "minivan" : "bus",
    passenger_capacity: capacity,
    luggage_capacity: 0,
    transmission: "automatic",
    features: {
      air_conditioning: true,
      wifi: false,
      child_seat_available: false,
    },
    rates: {
      base_minor: baseMinor,
      per_km_minor: 0,
      per_hour_minor: 0,
      currency: "AMD",
    },
    cover_image: null,
    gallery: [],
  };
}

describe("selectBestVehicleCategory", () => {
  const cars = [car(1, 4, 5_000), car(2, 7, 10_000), car(3, 22, 20_000)];

  it("uses one suitable vehicle instead of multiple smaller vehicles", () => {
    expect(selectBestVehicleCategory(cars, 6)?.id).toBe(2);
  });

  it("minimizes vehicle count for large groups", () => {
    expect(selectBestVehicleCategory(cars, 80)?.id).toBe(3);
  });
});
