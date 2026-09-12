import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@/i18n";
import type { Car } from "@/types/domain";
import { PremierCarModal, PremierCarSelection } from "./PremierCarModal";

const premierCar: Car = {
  id: 41,
  name: "Mercedes-Benz S-Class",
  brand: "Mercedes-Benz",
  model: "S-Class",
  year: 2026,
  color: "Black",
  category: "premium",
  type: "premier",
  passenger_capacity: 3,
  luggage_capacity: 2,
  transmission: "automatic",
  features: {
    air_conditioning: true,
    wifi: true,
    child_seat_available: true,
  },
  rates: {
    base_minor: 10_000,
    per_km_minor: 100,
    per_hour_minor: 0,
    currency: "EUR",
  },
  cover_image: null,
  gallery: [],
};

describe("PremierCarModal", () => {
  it("lets the customer choose an exact Premier car", () => {
    const onSelect = vi.fn();

    render(
      <PremierCarModal
        open
        cars={[premierCar]}
        selectedCarId={0}
        onSelect={onSelect}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Choose your Premier car" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Mercedes-Benz S-Class")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Choose this car" }));
    expect(onSelect).toHaveBeenCalledWith(premierCar);
  });

  it("closes when Escape is pressed", () => {
    const onClose = vi.fn();

    render(
      <PremierCarModal
        open
        cars={[]}
        selectedCarId={0}
        onSelect={vi.fn()}
        onClose={onClose}
      />,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe("PremierCarSelection", () => {
  it("can show only the selected car name", () => {
    const { container } = render(
      <PremierCarSelection car={premierCar} onOpen={vi.fn()} nameOnly />,
    );
    const selection = within(container);

    expect(selection.getByText("Mercedes-Benz S-Class")).toBeInTheDocument();
    expect(selection.queryByRole("img")).not.toBeInTheDocument();
    expect(selection.queryByText(/3 guests/)).not.toBeInTheDocument();
  });
});
