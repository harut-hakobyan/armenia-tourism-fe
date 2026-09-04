import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react'
import { adminApi, type CarAdminInput, type DirectoryItem } from '@/features/admin/api'
import { Button } from '@/components/ui/Button'
import { NumericInput } from '@/components/ui/NumericInput'
import { toApiError } from '@/lib/api-client'
import { fromMinorUnits, toMinorUnits } from '@/lib/money'

type CarForm = Omit<CarAdminInput, 'base_price_minor' | 'price_per_km_minor' | 'price_per_hour_minor'> & {
  base_price: number
  price_per_km: number
  price_per_hour: number
}

const emptyForm: CarForm = {
  brand: '', model: '', year: new Date().getFullYear(), plate_number: '', color: '', category: 'comfort',
  passenger_capacity: 4, luggage_capacity: 2, transmission: 'automatic', air_conditioning: true,
  wifi: false, child_seat_available: false, base_price: 0, price_per_km: 0, price_per_hour: 0,
  currency: 'EUR', active: true, available_for_booking: true,
}

function fromItem(item: DirectoryItem): CarForm {
  const currency: CarForm['currency'] = item.currency === 'USD' || item.currency === 'AMD' ? item.currency : 'EUR'

  return {
    brand: item.brand ?? '', model: item.model ?? '', year: item.year ?? new Date().getFullYear(),
    plate_number: item.plate_number ?? '', color: item.color ?? '', category: (item.category ?? 'comfort') as CarForm['category'],
    passenger_capacity: item.passenger_capacity ?? 4, luggage_capacity: item.luggage_capacity ?? 0,
    transmission: item.transmission ?? '', air_conditioning: item.air_conditioning ?? true,
    wifi: item.wifi ?? false, child_seat_available: item.child_seat_available ?? false,
    base_price: fromMinorUnits(item.base_price_minor ?? 0, currency), price_per_km: fromMinorUnits(item.price_per_km_minor ?? 0, currency),
    price_per_hour: fromMinorUnits(item.price_per_hour_minor ?? 0, currency), currency,
    active: item.active, available_for_booking: item.available_for_booking ?? true,
  }
}

function payload(form: CarForm): CarAdminInput {
  return {
    ...form, color: form.color || null, transmission: form.transmission || null,
    base_price_minor: toMinorUnits(form.base_price, form.currency),
    price_per_km_minor: toMinorUnits(form.price_per_km, form.currency),
    price_per_hour_minor: toMinorUnits(form.price_per_hour, form.currency),
  }
}

export function AdminCarsPage() {
  const client = useQueryClient()
  const query = useQuery({ queryKey: ['admin', 'directory', 'cars'], queryFn: () => adminApi.directory('cars') })
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<CarForm>(emptyForm)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refresh = async () => client.invalidateQueries({ queryKey: ['admin', 'directory', 'cars'] })
  const save = useMutation({
    mutationFn: () => editing ? adminApi.updateDirectory('cars', editing, payload(form)) : adminApi.createCar(payload(form)),
    onSuccess: async () => { await refresh(); setOpen(false); setEditing(null); setForm(emptyForm) },
    onError: (reason) => setError(toApiError(reason).message),
  })
  const remove = useMutation({ mutationFn: adminApi.deleteCar, onSuccess: refresh, onError: (reason) => setError(toApiError(reason).message) })
  const upload = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => adminApi.uploadMedia('cars', id, file, 'cover'),
    onSuccess: refresh,
    onError: (reason) => setError(toApiError(reason).message),
  })
  const removeImage = useMutation({
    mutationFn: adminApi.deleteMedia,
    onSuccess: refresh,
    onError: (reason) => setError(toApiError(reason).message),
  })

  function field<K extends keyof CarForm>(key: K, value: CarForm[K]) { setForm((current) => ({ ...current, [key]: value })) }
  function add() { setEditing(null); setForm(emptyForm); setError(null); setOpen(true) }
  function edit(item: DirectoryItem) { setEditing(item.id); setForm(fromItem(item)); setError(null); setOpen(true) }

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-apricot">Catalog & fleet</p><h1 className="mt-2 text-3xl font-bold">Cars</h1></div><Button onClick={add}><Plus className="mr-2 size-4" />Add car</Button></div>
    {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-danger">{error}</p>}
    {open && <form onSubmit={(event) => { event.preventDefault(); save.mutate() }} className="mt-7 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editing ? 'Edit car' : 'Add car'}</h2><button type="button" onClick={() => setOpen(false)} className="text-sm font-bold text-ink/50">Close</button></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Text label="Brand" value={form.brand} onChange={(value) => field('brand', value)} required />
        <Text label="Model" value={form.model} onChange={(value) => field('model', value)} required />
        <NumberField label="Year" value={form.year} onChange={(value) => field('year', value)} min={1980} required />
        <Text label="Plate number" value={form.plate_number} onChange={(value) => field('plate_number', value)} required />
        <Text label="Color" value={form.color ?? ''} onChange={(value) => field('color', value)} />
        <label className="text-sm font-semibold">Category<select value={form.category} onChange={(event) => field('category', event.target.value as CarForm['category'])} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3">{['economy','comfort','business','suv','minivan','premium'].map((category) => <option key={category}>{category}</option>)}</select></label>
        <NumberField label="Passenger capacity" value={form.passenger_capacity} onChange={(value) => field('passenger_capacity', value)} min={1} required />
        <NumberField label="Luggage capacity" value={form.luggage_capacity} onChange={(value) => field('luggage_capacity', value)} min={0} required />
        <Text label="Transmission" value={form.transmission ?? ''} onChange={(value) => field('transmission', value)} />
        <NumberField label={`Base price (${form.currency})`} value={form.base_price} onChange={(value) => field('base_price', value)} min={0} step={form.currency === 'AMD' ? '1' : '0.01'} required />
        <NumberField label={`Price / km (${form.currency})`} value={form.price_per_km} onChange={(value) => field('price_per_km', value)} min={0} step={form.currency === 'AMD' ? '1' : '0.01'} required />
        <NumberField label={`Price / hour (${form.currency})`} value={form.price_per_hour} onChange={(value) => field('price_per_hour', value)} min={0} step={form.currency === 'AMD' ? '1' : '0.01'} required />
        <label className="text-sm font-semibold">Currency<select value={form.currency} onChange={(event) => field('currency', event.target.value as CarForm['currency'])} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3">{['EUR','USD','AMD'].map((currency) => <option key={currency}>{currency}</option>)}</select></label>
      </div>
      <div className="mt-6 flex flex-wrap gap-5">{([['air_conditioning','Air conditioning'],['wifi','Wi-Fi'],['child_seat_available','Child seat'],['active','Active'],['available_for_booking','Available for assignment']] as const).map(([key,label]) => <label key={key} className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form[key]} onChange={(event) => field(key, event.target.checked)} />{label}</label>)}</div>
      <Button type="submit" disabled={save.isPending} className="mt-7">{save.isPending ? 'Saving…' : 'Save car'}</Button>
    </form>}
    <div className="mt-7 overflow-hidden rounded-2xl bg-white shadow-sm">{query.data?.data.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-5 border-b border-black/5 px-5 py-4"><div className="flex items-center gap-4">{item.cover_image ? <img src={item.cover_image.url} alt="" className="size-16 rounded-xl object-cover" /> : <div className="grid size-16 place-items-center rounded-xl bg-stone text-ink/30"><ImagePlus /></div>}<div><p className="font-semibold">{item.brand} {item.model}</p><p className="mt-1 text-xs text-ink/45">{item.year} · {item.plate_number} · {item.category} · {item.passenger_capacity} passengers</p></div></div><div className="flex flex-wrap items-center gap-2"><label className="cursor-pointer rounded-full bg-black/5 px-3 py-2 text-xs font-bold text-ink/60">{item.cover_image ? 'Change image' : 'Add image'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload.mutate({ id: item.id, file }); event.target.value = '' }} /></label>{item.cover_image && <button onClick={() => { if (window.confirm('Remove this car image?')) removeImage.mutate(item.cover_image!.id) }} className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-danger">Remove image</button>}<button onClick={() => edit(item)} className="grid size-9 place-items-center rounded-full bg-black/5" aria-label="Edit car"><Pencil className="size-4" /></button><button onClick={() => { if (window.confirm(`Remove ${item.brand} ${item.model}?`)) remove.mutate(item.id) }} className="grid size-9 place-items-center rounded-full bg-red-50 text-danger" aria-label="Remove car"><Trash2 className="size-4" /></button></div></div>)}</div>
    <p className="mt-4 text-sm text-ink/45">{query.data?.total ?? 0} total cars</p>
  </div>
}

function Text({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="text-sm font-semibold">{label}<input value={value} onChange={(event) => onChange(event.target.value)} required={required} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3" /></label>
}

function NumberField({ label, value, onChange, min, step = '1', required = false }: { label: string; value: number; onChange: (value: number) => void; min: number; step?: string; required?: boolean }) {
  return <label className="text-sm font-semibold">{label}<NumericInput value={value} onValueChange={(next) => { if (next !== null) onChange(next) }} min={min} decimal={step !== '1'} required={required} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3" /></label>
}
