import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BusFront, CarFront } from "lucide-react";
import { adminApi, type CarTypePrice } from "@/features/admin/api";
import { Button } from "@/components/ui/Button";
import { NumericInput } from "@/components/ui/NumericInput";
import { toApiError } from "@/lib/api-client";
import { fromMinorUnits, toMinorUnits } from "@/lib/money";

export function AdminCarTypePricesPage() {
  const prices = useQuery({
    queryKey: ["admin", "car-type-prices"],
    queryFn: adminApi.carTypePrices,
  });

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-apricot">
          Cars
        </p>
        <h1 className="mt-2 text-3xl font-bold">Vehicle type prices</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">
          Set the standard fixed price and the per-kilometre rate used by Build
          Your Trip. Premier capacity is configured separately for each car.
        </p>
      </div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {prices.data?.map((price) => (
          <TypePriceEditor
            key={`${price.type}-${price.fixed_price_minor}-${price.price_per_km_minor}-${price.currency}`}
            initial={price}
            onSaved={() => void prices.refetch()}
          />
        ))}
      </div>
    </div>
  );
}

function TypePriceEditor({
  initial,
  onSaved,
}: {
  initial: CarTypePrice;
  onSaved: () => void;
}) {
  const [fixedAmount, setFixedAmount] = useState(
    fromMinorUnits(initial.fixed_price_minor, initial.currency),
  );
  const [perKilometreAmount, setPerKilometreAmount] = useState(
    fromMinorUnits(initial.price_per_km_minor, initial.currency),
  );
  const [currency, setCurrency] = useState(initial.currency);
  const [error, setError] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: () =>
      adminApi.updateCarTypePrice(initial.type, {
        fixed_price_minor: toMinorUnits(fixedAmount, currency),
        price_per_km_minor: toMinorUnits(perKilometreAmount, currency),
        currency,
      }),
    onSuccess: onSaved,
    onError: (reason) => setError(toApiError(reason).message),
  });
  const Icon = initial.type === "premier" || initial.type === "sedan" ? CarFront : BusFront;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-stone text-forest">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold capitalize">{initial.type}</h2>
          <p className="mt-0.5 text-xs font-semibold text-ink/45">
            {initial.passenger_capacity === null
              ? "Passenger capacity varies by car"
              : `Maximum ${initial.passenger_capacity} passengers`}
          </p>
        </div>
      </div>
      <label className="mt-5 block text-sm font-semibold">
        Standard fixed price
        <div className="mt-2 flex gap-2">
          <NumericInput
            value={fixedAmount}
            onValueChange={(value) => {
              if (value !== null) setFixedAmount(value);
            }}
            min={0}
            decimal={currency !== "AMD"}
            className="min-w-0 flex-1 rounded-xl border border-black/10 px-3"
          />
          <select
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value as CarTypePrice["currency"])
            }
            className="rounded-xl border border-black/10 bg-white px-3"
          >
            {(["EUR", "USD", "AMD"] as const).map((code) => (
              <option key={code}>{code}</option>
            ))}
          </select>
        </div>
      </label>
      <label className="mt-4 block text-sm font-semibold">
        Price per KM
        <div className="mt-2 flex">
          <NumericInput
            value={perKilometreAmount}
            onValueChange={(value) => {
              if (value !== null) setPerKilometreAmount(value);
            }}
            min={0}
            decimal={currency !== "AMD"}
            className="min-w-0 flex-1 rounded-l-xl border border-black/10 px-3"
          />
          <span className="flex items-center rounded-r-xl border border-l-0 border-black/10 bg-stone px-3 text-xs font-bold text-ink/55">
            {currency} / km
          </span>
        </div>
      </label>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      <Button
        type="button"
        onClick={() => {
          setError(null);
          save.mutate();
        }}
        disabled={save.isPending}
        className="mt-5 w-full"
      >
        {save.isPending ? "Saving…" : "Save prices"}
      </Button>
    </section>
  );
}
