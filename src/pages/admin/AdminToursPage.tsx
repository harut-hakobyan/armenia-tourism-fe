import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { adminApi, type AdminTour, type TourAdminInput } from '@/features/admin/api'
import { toApiError } from '@/lib/api-client'
import { Checkbox, NumberField, TextField, TranslationFields } from './AdminCatalogControls'
import { emptyTranslations, type LocalizedContent } from './admin-catalog-types'

interface TourForm extends Omit<TourAdminInput, 'starting_price_minor' | 'translations'> { starting_price:number; translations:LocalizedContent[] }

const emptyForm = (): TourForm => ({
  category_id:null, slug:'', duration_minutes:480, approximate_distance_km:null, starting_price:0,
  currency:'EUR', pricing_type:'per_car', format:'private', active:true, featured:false,
  max_passengers:4, pickup_available:true, dropoff_available:true, free_cancellation_hours:24,
  sort_order:0, translations:emptyTranslations(),
})

function fromTour(tour:AdminTour):TourForm {
  return {...tour, starting_price:tour.starting_price_minor/100, translations:emptyTranslations().map((empty) => {
    const translation=tour.translations.find((item) => item.locale===empty.locale)
    return {...empty, label:translation?.title??'', short_description:translation?.short_description??'', description:translation?.description??'', seo_title:translation?.seo_title??'', seo_description:translation?.seo_description??''}
  })}
}

function payload(form:TourForm):TourAdminInput {
  const {starting_price,translations,...fields}=form
  return {...fields,starting_price_minor:Math.round(starting_price*100),translations:translations.map(({label,...translation})=>({...translation,title:label,short_description:translation.short_description||null,description:translation.description||null,seo_title:translation.seo_title||null,seo_description:translation.seo_description||null}))}
}

function title(tour:AdminTour){return tour.translations.find((translation)=>translation.locale==='en')?.title??tour.slug}

export function AdminToursPage(){
  const client=useQueryClient(); const queryKey=['admin','directory','tours'] as const
  const tours=useQuery({queryKey,queryFn:adminApi.tours}); const categories=useQuery({queryKey:['admin','tour-categories'],queryFn:adminApi.tourCategories})
  const [open,setOpen]=useState(false); const [editing,setEditing]=useState<number|null>(null); const [form,setForm]=useState<TourForm>(emptyForm); const [error,setError]=useState<string|null>(null)
  const refresh=async()=>client.invalidateQueries({queryKey})
  const save=useMutation({mutationFn:()=>editing?adminApi.updateTour(editing,payload(form)):adminApi.createTour(payload(form)),onSuccess:async()=>{await refresh();setOpen(false);setEditing(null)},onError:(reason)=>setError(toApiError(reason).message)})
  const remove=useMutation({mutationFn:adminApi.deleteTour,onSuccess:refresh,onError:(reason)=>setError(toApiError(reason).message)})
  const upload=useMutation({mutationFn:({id,file}:{id:number;file:File})=>adminApi.uploadMedia('tours',id,file,'cover'),onSuccess:refresh,onError:(reason)=>setError(toApiError(reason).message)})
  const removeImage=useMutation({mutationFn:adminApi.deleteMedia,onSuccess:refresh,onError:(reason)=>setError(toApiError(reason).message)})
  function field<K extends keyof TourForm>(key:K,value:TourForm[K]){setForm((current)=>({...current,[key]:value}))}
  function add(){setForm(emptyForm());setEditing(null);setError(null);setOpen(true)}
  function edit(tour:AdminTour){setForm(fromTour(tour));setEditing(tour.id);setError(null);setOpen(true)}

  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-apricot">Catalog</p><h1 className="mt-2 text-3xl font-bold">Tours</h1></div><Button onClick={add}><Plus className="mr-2 size-4"/>Add tour</Button></div>
    {error&&<p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-danger">{error}</p>}
    {open&&<form onSubmit={(event)=>{event.preventDefault();save.mutate()}} className="mt-7 rounded-3xl bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editing?'Edit tour':'Add tour'}</h2><button type="button" onClick={()=>setOpen(false)} aria-label="Close form"><X/></button></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><TextField label="Slug" value={form.slug} onChange={(value)=>field('slug',value)} required/><label className="text-sm font-semibold">Category<select value={form.category_id??''} onChange={(event)=>field('category_id',event.target.value?Number(event.target.value):null)} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3"><option value="">No category</option>{categories.data?.map((category)=><option value={category.id} key={category.id}>{category.translations.find((item)=>item.locale==='en')?.name??category.slug}</option>)}</select></label>
        <label className="text-sm font-semibold">Tour type<select value={form.format} onChange={(event)=>field('format',event.target.value as TourForm['format'])} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3"><option value="private">Private</option><option value="group">Group</option></select></label>
        <label className="text-sm font-semibold">Pricing type<select value={form.pricing_type} onChange={(event)=>field('pricing_type',event.target.value as TourForm['pricing_type'])} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3"><option value="per_car">Per car</option><option value="per_person">Per person</option><option value="fixed">Fixed</option><option value="custom">Custom</option></select></label>
        <NumberField label={`Starting price (${form.currency})`} value={form.starting_price} onChange={(value)=>field('starting_price',value??0)} min={0} step="0.01" required/><label className="text-sm font-semibold">Currency<select value={form.currency} onChange={(event)=>field('currency',event.target.value as TourForm['currency'])} className="mt-2 min-h-11 w-full rounded-xl border border-black/10 px-3">{['EUR','USD','AMD'].map((currency)=><option key={currency}>{currency}</option>)}</select></label>
        <NumberField label="Duration (minutes)" value={form.duration_minutes} onChange={(value)=>field('duration_minutes',value??1)} min={1} required/><NumberField label="Distance (km)" value={form.approximate_distance_km} onChange={(value)=>field('approximate_distance_km',value)} min={0}/><NumberField label="Maximum passengers" value={form.max_passengers} onChange={(value)=>field('max_passengers',value)} min={1}/><NumberField label="Free cancellation (hours)" value={form.free_cancellation_hours} onChange={(value)=>field('free_cancellation_hours',value??0)} min={0} required/><NumberField label="Sort order" value={form.sort_order} onChange={(value)=>field('sort_order',value??0)} min={0} required/>
      </div><div className="mt-6 flex flex-wrap gap-5"><Checkbox label="Active" checked={form.active} onChange={(value)=>field('active',value)}/><Checkbox label="Featured" checked={form.featured} onChange={(value)=>field('featured',value)}/><Checkbox label="Pickup available" checked={form.pickup_available} onChange={(value)=>field('pickup_available',value)}/><Checkbox label="Drop-off available" checked={form.dropoff_available} onChange={(value)=>field('dropoff_available',value)}/></div>
      <TranslationFields noun="Tour title" value={form.translations} onChange={(value)=>field('translations',value)}/><Button type="submit" disabled={save.isPending} className="mt-7">{save.isPending?'Saving…':'Save tour'}</Button></form>}
    <div className="mt-7 overflow-hidden rounded-2xl bg-white shadow-sm">{tours.isPending&&<p className="p-5 text-sm text-ink/50">Loading tours…</p>}{tours.data?.data.map((tour)=><div key={tour.id} className="flex flex-wrap items-center justify-between gap-5 border-b border-black/5 px-5 py-4"><div className="flex items-center gap-4">{tour.cover_image?<img src={tour.cover_image.url} alt="" className="size-16 rounded-xl object-cover"/>:<div className="grid size-16 place-items-center rounded-xl bg-stone text-ink/30"><ImagePlus/></div>}<div><p className="font-semibold">{title(tour)}</p><p className="mt-1 text-xs text-ink/45">{tour.slug} · {tour.format} · {tour.currency} {(tour.starting_price_minor/100).toFixed(2)}</p></div></div><div className="flex flex-wrap items-center gap-2"><label className="cursor-pointer rounded-full bg-black/5 px-3 py-2 text-xs font-bold text-ink/60">{tour.cover_image?'Change image':'Add image'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event)=>{const file=event.target.files?.[0];if(file)upload.mutate({id:tour.id,file});event.target.value='' }}/></label>{tour.cover_image&&<button onClick={()=>{if(window.confirm('Remove this tour image?'))removeImage.mutate(tour.cover_image!.id)}} className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-danger">Remove image</button>}<button onClick={()=>edit(tour)} className="grid size-9 place-items-center rounded-full bg-black/5" aria-label="Edit tour"><Pencil className="size-4"/></button><button onClick={()=>{if(window.confirm(`Delete ${title(tour)}?`))remove.mutate(tour.id)}} className="grid size-9 place-items-center rounded-full bg-red-50 text-danger" aria-label="Delete tour"><Trash2 className="size-4"/></button></div></div>)}</div><p className="mt-4 text-sm text-ink/45">{tours.data?.total??0} total tours</p>
  </div>
}
