import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleDollarSign } from "lucide-react";
import { adminApi, type CarCategoryPrice } from "@/features/admin/api";
import { Button } from "@/components/ui/Button";
import { NumericInput } from "@/components/ui/NumericInput";
import { toApiError } from "@/lib/api-client";
import { fromMinorUnits, toMinorUnits } from "@/lib/money";

export function AdminCarCategoryPricesPage() {
  const prices = useQuery({
    queryKey: ["admin", "car-category-prices"],
    queryFn: adminApi.carCategoryPrices,
  });

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-apricot">
          Cars
        </p>
        <h1 className="mt-2 text-3xl font-bold">Category prices</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">
          Set one fixed price for each car category. Every car in that category
          inherits the same price automatically.
        </p>
      </div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {prices.data?.map((price) => (
          <CategoryPriceEditor
            key={`${price.category}-${price.fixed_price_minor}-${price.currency}`}
            initial={price}
            onSaved={() => void prices.refetch()}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryPriceEditor({
  initial,
  onSaved,
}: {
  initial: CarCategoryPrice;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState(
    fromMinorUnits(initial.fixed_price_minor, initial.currency),
  );
  const [currency, setCurrency] = useState(initial.currency);
  const [error, setError] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: () =>
      adminApi.updateCarCategoryPrice(initial.category, {
        fixed_price_minor: toMinorUnits(amount, currency),
        currency,
      }),
    onSuccess: onSaved,
    onError: (reason) => setError(toApiError(reason).message),
  });

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-stone text-forest">
          <CircleDollarSign className="size-5" />
        </span>
        <h2 className="text-xl font-bold capitalize">{initial.category}</h2>
      </div>
      <label className="mt-5 block text-sm font-semibold">
        Fixed price
        <div className="mt-2 flex gap-2">
          <NumericInput
            value={amount}
            onValueChange={(value) => {
              if (value !== null) setAmount(value);
            }}
            min={0}
            decimal={currency !== "AMD"}
            className="min-w-0 flex-1 rounded-xl border border-black/10 px-3"
          />
          <select
            value={currency}
            onChange={(event) =>
              setCurrency(event.target.value as CarCategoryPrice["currency"])
            }
            className="rounded-xl border border-black/10 bg-white px-3"
          >
            {["EUR", "USD", "AMD"].map((code) => (
              <option key={code}>{code}</option>
            ))}
          </select>
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
        {save.isPending ? "Saving…" : "Save price"}
      </Button>
    </section>
  );
}
