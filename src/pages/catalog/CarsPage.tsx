import { Briefcase, Check, Snowflake, Users, Wifi } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Container } from '@/components/ui/Container'
import { carsQuery } from '@/features/catalog/api'

export function CarsPage() {
  const cars = useQuery(carsQuery({ per_page: 30 }))

  return (
      <Container className="py-16 sm:py-24">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-apricot">
          Our fleet
        </p>

        <h1 className="text-display mt-3 text-5xl sm:text-6xl">
          Comfort for every Armenian road
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-ink/60">
          Explore our maintained fleet. We assign the most suitable available
          vehicle for your group size and route.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.data?.data.map((car) => (
              <article
                  key={car.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Car Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone">
                  {car.cover_image ? (
                      <img
                          src={car.cover_image.url}
                          alt={car.name}
                          className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                  ) : (
                      <div className="flex h-full w-full items-center justify-center">
                  <span className="text-display text-3xl text-forest/30">
                    {car.category}
                  </span>
                      </div>
                  )}
                </div>

                {/* Car Information */}
                <div className="relative bg-white p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-apricot">
                    {car.category} · {car.year}
                  </p>

                  <h2 className="text-display mt-2 text-3xl leading-tight">
                    {car.name}
                  </h2>

                  <p className="mt-2 text-sm capitalize text-ink/50">
                    {car.color} · {car.transmission}
                  </p>

                  {/* Features */}
                  <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-ink/60">
                <span className="flex items-center gap-2">
                  <Users className="size-4 shrink-0" />
                  {car.passenger_capacity} guests
                </span>

                    <span className="flex items-center gap-2">
                  <Briefcase className="size-4 shrink-0" />
                      {car.luggage_capacity} bags
                </span>

                    {car.features.air_conditioning && (
                        <span className="flex items-center gap-2">
                    <Snowflake className="size-4 shrink-0" />
                    A/C
                  </span>
                    )}

                    {car.features.wifi && (
                        <span className="flex items-center gap-2">
                    <Wifi className="size-4 shrink-0" />
                    Wi-Fi
                  </span>
                    )}

                    {car.features.child_seat_available && (
                        <span className="flex items-center gap-2">
                    <Check className="size-4 shrink-0" />
                    Child seat
                  </span>
                    )}
                  </div>
                </div>
              </article>
          ))}
        </div>
      </Container>
  )
}