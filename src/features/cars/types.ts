import type { CarType } from "@/types/domain";

export const carTypes: CarType[] = ["sedan", "minivan", "minibus", "bus"];

export const carTypeCapacity: Record<CarType, number> = {
  sedan: 4,
  minivan: 6,
  minibus: 10,
  bus: 20,
};

export function isCarType(value: unknown): value is CarType {
  return typeof value === "string" && carTypes.includes(value as CarType);
}
