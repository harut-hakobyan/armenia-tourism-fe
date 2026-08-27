import { cn } from '@/lib/cn'

export function StatusBadge({status}:{status:string}){const tone=status==='completed'||status==='paid'?'bg-emerald-100 text-emerald-800':status==='cancelled'||status==='no_show'?'bg-red-100 text-red-800':status==='pending'||status==='unpaid'?'bg-amber-100 text-amber-800':'bg-blue-100 text-blue-800';return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize',tone)}>{status.replaceAll('_',' ')}</span>}
