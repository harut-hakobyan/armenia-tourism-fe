import type { Car } from "@/types/domain";

export function requiredVehicleCount(
  passengers: number,
  capacityPerVehicle: number,
): number {
  return Math.ceil(passengers / capacityPerVehicle);
}

export function selectBestVehicleType(
  cars: Car[],
  passengers: number,
): Car | undefined {
  return cars.reduce<Car | undefined>((best, candidate) => {
    if (!best) return candidate;

    const candidateCount = requiredVehicleCount(
      passengers,
      candidate.passenger_capacity,
    );
    const bestCount = requiredVehicleCount(
      passengers,
      best.passenger_capacity,
    );

    if (candidateCount !== bestCount) {
      return candidateCount < bestCount ? candidate : best;
    }

    const candidateTotal = candidateCount * candidate.rates.per_km_minor;
    const bestTotal = bestCount * best.rates.per_km_minor;

    if (candidateTotal !== bestTotal) {
      return candidateTotal < bestTotal ? candidate : best;
    }

    return candidate.passenger_capacity > best.passenger_capacity
      ? candidate
      : best;
  }, undefined);
}
