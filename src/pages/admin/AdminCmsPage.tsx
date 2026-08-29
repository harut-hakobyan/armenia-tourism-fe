import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi, type CmsItem, type CmsType } from '@/features/admin/api'
import { NumericInput } from '@/components/ui/NumericInput'

const titles:Record<CmsType,string>={customers:'Customers',reviews:'Reviews','promo-codes':'Promo codes',faqs:'FAQs',inquiries:'Contact inquiries','audit-logs':'Audit history'}

function itemTitle(type:CmsType,item:CmsItem){
  if(type==='customers') return [item.first_name,item.last_name].filter(Boolean).join(' ')||item.email||`Customer #${item.id}`
  if(type==='reviews') return `${item.customer_name} · ${item.rating}/5`
  if(type==='promo-codes') return item.code??`Promotion #${item.id}`
  if(type==='faqs') return item.translations?.find((translation)=>translation.locale==='en')?.question??`FAQ #${item.id}`
  if(type==='inquiries') return item.subject??`Inquiry #${item.id}`
  return item.action??`Audit #${item.id}`
}

function itemDetail(type:CmsType,item:CmsItem){
  if(type==='customers') return `${item.email??'No email'} · ${item.phone??'No phone'} · ${item.bookings_count??0} bookings`
  if(type==='reviews') return item.review
  if(type==='promo-codes') return `${item.type} · ${item.value} ${item.currency??''}`
  if(type==='faqs') return item.category
  if(type==='inquiries') return `${item.name??''} · ${item.email??''} · ${item.message??''}`
  return `${item.user?.name??'System'} · ${item.created_at??''}`
}

export function AdminCmsPage({type}:{type:CmsType}){
  const client=useQueryClient()
  const [promo,setPromo]=useState({code:'',type:'percentage' as 'percentage'|'fixed',value:10,currency:'EUR',active:true})
  const [faq,setFaq]=useState({category:'booking',question:'',answer:''})
  const query=useQuery({queryKey:['admin','cms',type],queryFn:()=>adminApi.cms(type)})
  const create=useMutation({mutationFn:async()=>type==='promo-codes'?adminApi.createPromo(promo):adminApi.createFaq({category:faq.category,active:true,sort_order:(query.data?.total??0)+1,translations:[{locale:'en',question:faq.question,answer:faq.answer}]}),onSuccess:async()=>{setPromo({...promo,code:''});setFaq({...faq,question:'',answer:''});await client.invalidateQueries({queryKey:['admin','cms',type]})}})
  const change=useMutation({mutationFn:async({item,value}:{item:CmsItem;value:string|boolean})=>{
    if(type==='reviews') return adminApi.updateReview(item.id,Boolean(value))
    if(type==='promo-codes') return adminApi.updatePromo(item.id,Boolean(value))
    if(type==='faqs') return adminApi.updateFaq(item,Boolean(value))
    if(type==='inquiries') return adminApi.updateInquiry(item.id,value as 'new'|'in_progress'|'resolved')
    return item
  },onSuccess:async()=>client.invalidateQueries({queryKey:['admin','cms',type]})})
  return <div><p className="text-sm font-semibold uppercase tracking-widest text-apricot">Content management</p><h1 className="mt-2 text-3xl font-bold">{titles[type]}</h1>
    {type==='promo-codes'&&<form className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-white p-4 shadow-sm" onSubmit={(event)=>{event.preventDefault();create.mutate()}}><input required className="rounded-xl border border-black/10 px-3 py-2" placeholder="CODE" value={promo.code} onChange={(event)=>setPromo({...promo,code:event.target.value.toUpperCase()})}/><select className="rounded-xl border border-black/10 px-3 py-2" value={promo.type} onChange={(event)=>setPromo({...promo,type:event.target.value as 'percentage'|'fixed'})}><option value="percentage">Percentage</option><option value="fixed">Fixed minor units</option></select><NumericInput required min={1} value={promo.value} onValueChange={(value)=>{if(value!==null)setPromo({...promo,value})}} className="w-32 rounded-xl border border-black/10 px-3 py-2"/><button className="rounded-xl bg-forest px-4 py-2 text-sm font-bold text-white">Add promo</button></form>}
    {type==='faqs'&&<form className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm" onSubmit={(event)=>{event.preventDefault();create.mutate()}}><select className="rounded-xl border border-black/10 px-3 py-2" value={faq.category} onChange={(event)=>setFaq({...faq,category:event.target.value})}><option>booking</option><option>payments</option><option>tours</option><option>drivers</option><option>airport transfers</option><option>cancellation</option></select><input required className="rounded-xl border border-black/10 px-3 py-2" placeholder="Question in English" value={faq.question} onChange={(event)=>setFaq({...faq,question:event.target.value})}/><textarea required className="rounded-xl border border-black/10 px-3 py-2" placeholder="Answer in English" value={faq.answer} onChange={(event)=>setFaq({...faq,answer:event.target.value})}/><button className="justify-self-start rounded-xl bg-forest px-4 py-2 text-sm font-bold text-white">Add FAQ</button></form>}
    <div className="mt-7 overflow-hidden rounded-2xl bg-white shadow-sm">{query.data?.data.map((item)=><div key={item.id} className="flex flex-col gap-3 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-semibold">{itemTitle(type,item)}</p><p className="mt-1 line-clamp-2 text-sm text-ink/50">{itemDetail(type,item)}</p></div>
      {(type==='reviews'||type==='promo-codes'||type==='faqs')&&<button onClick={()=>change.mutate({item,value:!item.active})} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${item.active?'bg-emerald-100 text-emerald-800':'bg-black/5 text-ink/50'}`}>{item.active?'Active':'Inactive'}</button>}
      {type==='inquiries'&&<select className="rounded-xl border border-black/10 px-3 py-2 text-sm" value={item.status} onChange={(event)=>change.mutate({item,value:event.target.value})}><option value="new">New</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option></select>}
    </div>)}</div><p className="mt-4 text-sm text-ink/45">{query.data?.total??0} total records</p></div>
}

export function AdminSettingsPage(){
  const client=useQueryClient();const query=useQuery({queryKey:['admin','settings'],queryFn:adminApi.settings});const [drafts,setDrafts]=useState<Record<number,string>>({});const save=useMutation({mutationFn:({id,value}:{id:number;value:string})=>adminApi.updateSetting(id,value),onSuccess:async()=>client.invalidateQueries({queryKey:['admin','settings']})})
  return <div><p className="text-sm font-semibold uppercase tracking-widest text-apricot">Super admin</p><h1 className="mt-2 text-3xl font-bold">Website settings</h1><div className="mt-7 grid gap-4">{query.data?.map((item)=><label key={item.id} className="rounded-2xl bg-white p-5 shadow-sm"><span className="text-sm font-bold">{item.key.replaceAll('_',' ')}</span><div className="mt-2 flex gap-2"><input className="min-w-0 flex-1 rounded-xl border border-black/10 px-3 py-2" value={drafts[item.id]??item.value??''} onChange={(event)=>setDrafts({...drafts,[item.id]:event.target.value})}/><button className="rounded-xl bg-forest px-4 text-sm font-bold text-white" onClick={()=>save.mutate({id:item.id,value:drafts[item.id]??item.value??''})}>Save</button></div></label>)}</div></div>
}
