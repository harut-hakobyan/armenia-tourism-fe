import type { CatalogLocale, LocalizedContent } from './admin-catalog-types'

export function TranslationFields({ noun, value, onChange }: { noun: 'Tour title' | 'Destination name'; value: LocalizedContent[]; onChange: (value: LocalizedContent[]) => void }) {
  function field(locale: CatalogLocale, key: keyof Omit<LocalizedContent, 'locale'>, nextValue: string) {
    onChange(value.map((translation) => translation.locale === locale ? { ...translation, [key]: nextValue } : translation))
  }

  return <div className="mt-7 space-y-5">
    <h3 className="text-lg font-bold">Translations</h3>
    {value.map((translation) => <section key={translation.locale} className="rounded-2xl border border-black/8 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-apricot">{translation.locale}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextField label={`${noun} (${translation.locale.toUpperCase()})`} value={translation.label} onChange={(next) => field(translation.locale, 'label', next)} required />
        <TextField label="SEO title" value={translation.seo_title} onChange={(next) => field(translation.locale, 'seo_title', next)} />
        <TextArea label="Short description" value={translation.short_description} onChange={(next) => field(translation.locale, 'short_description', next)} />
        <TextArea label="SEO description" value={translation.seo_description} onChange={(next) => field(translation.locale, 'seo_description', next)} />
        <div className="sm:col-span-2"><TextArea label="Full description" value={translation.description} onChange={(next) => field(translation.locale, 'description', next)} rows={5} /></div>
      </div>
    </section>)}
  </div>
}

export function TextField({ label, value, onChange, required = false }: { label:string; value:string; onChange:(value:string)=>void; required?:boolean }) {
  return <label className="text-sm font-semibold">{label}<input value={value} onChange={(event) => onChange(event.target.value)} required={required} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3" /></label>
}

export function TextArea({ label, value, onChange, rows = 3 }: { label:string; value:string; onChange:(value:string)=>void; rows?:number }) {
  return <label className="text-sm font-semibold">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2" /></label>
}

export function NumberField({ label, value, onChange, min, max, step = '1', required = false }: { label:string; value:number|null; onChange:(value:number|null)=>void; min?:number; max?:number; step?:string; required?:boolean }) {
  return <label className="text-sm font-semibold">{label}<input type="number" value={value ?? ''} onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))} min={min} max={max} step={step} required={required} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3" /></label>
}

export function Checkbox({ label, checked, onChange }: { label:string; checked:boolean; onChange:(value:boolean)=>void }) {
  return <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>
}
