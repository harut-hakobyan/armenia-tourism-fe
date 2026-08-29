import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { adminApi, type AdminDestination, type DestinationAdminInput } from '@/features/admin/api'
import { toApiError } from '@/lib/api-client'
import { Checkbox, NumberField, TextField, TranslationFields } from './AdminCatalogControls'
import { emptyTranslations, type LocalizedContent } from './admin-catalog-types'

interface DestinationForm extends Omit<DestinationAdminInput,'translations'> { translations:LocalizedContent[] }

const emptyForm=():DestinationForm=>({slug:'',latitude:null,longitude:null,address:null,active:true,featured:false,sort_order:0,translations:emptyTranslations()})

function fromDestination(destination:AdminDestination):DestinationForm {
  return {...destination,translations:emptyTranslations().map((empty)=>{const translation=destination.translations.find((item)=>item.locale===empty.locale);return {...empty,label:translation?.name??'',short_description:translation?.short_description??'',description:translation?.description??'',seo_title:translation?.seo_title??'',seo_description:translation?.seo_description??''}})}
}

function payload(form:DestinationForm):DestinationAdminInput {
  return {...form,address:form.address||null,translations:form.translations.map(({label,...translation})=>({...translation,name:label,short_description:translation.short_description||null,description:translation.description||null,seo_title:translation.seo_title||null,seo_description:translation.seo_description||null}))}
}

function name(destination:AdminDestination){return destination.translations.find((translation)=>translation.locale==='en')?.name??destination.slug}

export function AdminDestinationsPage(){
  const client=useQueryClient();const queryKey=['admin','directory','destinations'] as const
  const destinations=useQuery({queryKey,queryFn:adminApi.destinations});const [open,setOpen]=useState(false);const [editing,setEditing]=useState<number|null>(null);const [form,setForm]=useState<DestinationForm>(emptyForm);const [error,setError]=useState<string|null>(null)
  const refresh=async()=>client.invalidateQueries({queryKey})
  const save=useMutation({mutationFn:()=>editing?adminApi.updateDestination(editing,payload(form)):adminApi.createDestination(payload(form)),onSuccess:async()=>{await refresh();setOpen(false);setEditing(null)},onError:(reason)=>setError(toApiError(reason).message)})
  const remove=useMutation({mutationFn:adminApi.deleteDestination,onSuccess:refresh,onError:(reason)=>setError(toApiError(reason).message)})
  const upload=useMutation({mutationFn:({id,file}:{id:number;file:File})=>adminApi.uploadMedia('destinations',id,file,'cover'),onSuccess:refresh,onError:(reason)=>setError(toApiError(reason).message)})
  const removeImage=useMutation({mutationFn:adminApi.deleteMedia,onSuccess:refresh,onError:(reason)=>setError(toApiError(reason).message)})
  function field<K extends keyof DestinationForm>(key:K,value:DestinationForm[K]){setForm((current)=>({...current,[key]:value}))}
  function add(){setForm(emptyForm());setEditing(null);setError(null);setOpen(true)}
  function edit(destination:AdminDestination){setForm(fromDestination(destination));setEditing(destination.id);setError(null);setOpen(true)}

  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-apricot">Catalog</p><h1 className="mt-2 text-3xl font-bold">Destinations</h1></div><Button onClick={add}><Plus className="mr-2 size-4"/>Add destination</Button></div>
    {error&&<p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-danger">{error}</p>}
    {open&&<form onSubmit={(event)=>{event.preventDefault();save.mutate()}} className="mt-7 rounded-3xl bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editing?'Edit destination':'Add destination'}</h2><button type="button" onClick={()=>setOpen(false)} aria-label="Close form"><X/></button></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><TextField label="Slug" value={form.slug} onChange={(value)=>field('slug',value)} required/><TextField label="Address" value={form.address??''} onChange={(value)=>field('address',value)}/><NumberField label="Latitude" value={form.latitude} onChange={(value)=>field('latitude',value)} min={-90} max={90} step="0.0000001"/><NumberField label="Longitude" value={form.longitude} onChange={(value)=>field('longitude',value)} min={-180} max={180} step="0.0000001"/><NumberField label="Sort order" value={form.sort_order} onChange={(value)=>field('sort_order',value??0)} min={0} required/></div>
      <div className="mt-6 flex flex-wrap gap-5"><Checkbox label="Active" checked={form.active} onChange={(value)=>field('active',value)}/><Checkbox label="Featured" checked={form.featured} onChange={(value)=>field('featured',value)}/></div>
      <TranslationFields noun="Destination name" value={form.translations} onChange={(value)=>field('translations',value)}/><Button type="submit" disabled={save.isPending} className="mt-7">{save.isPending?'Saving…':'Save destination'}</Button></form>}
    <div className="mt-7 overflow-hidden rounded-2xl bg-white shadow-sm">{destinations.isPending&&<p className="p-5 text-sm text-ink/50">Loading destinations…</p>}{destinations.data?.data.map((destination)=><div key={destination.id} className="flex flex-wrap items-center justify-between gap-5 border-b border-black/5 px-5 py-4"><div className="flex items-center gap-4">{destination.cover_image?<img src={destination.cover_image.url} alt="" className="size-16 rounded-xl object-cover"/>:<div className="grid size-16 place-items-center rounded-xl bg-stone text-ink/30"><ImagePlus/></div>}<div><p className="font-semibold">{name(destination)}</p><p className="mt-1 text-xs text-ink/45">{destination.slug}{destination.address?` · ${destination.address}`:''}</p></div></div><div className="flex flex-wrap items-center gap-2"><label className="cursor-pointer rounded-full bg-black/5 px-3 py-2 text-xs font-bold text-ink/60">{destination.cover_image?'Change image':'Add image'}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event)=>{const file=event.target.files?.[0];if(file)upload.mutate({id:destination.id,file});event.target.value=''}}/></label>{destination.cover_image&&<button onClick={()=>{if(window.confirm('Remove this destination image?'))removeImage.mutate(destination.cover_image!.id)}} className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-danger">Remove image</button>}<button onClick={()=>edit(destination)} className="grid size-9 place-items-center rounded-full bg-black/5" aria-label="Edit destination"><Pencil className="size-4"/></button><button onClick={()=>{if(window.confirm(`Delete ${name(destination)}?`))remove.mutate(destination.id)}} className="grid size-9 place-items-center rounded-full bg-red-50 text-danger" aria-label="Delete destination"><Trash2 className="size-4"/></button></div></div>)}</div><p className="mt-4 text-sm text-ink/45">{destinations.data?.total??0} total destinations</p>
  </div>
}
