import { CalendarDays, CarFront, Gauge, LogOut, Map, MapPin, Mountain, UsersRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useAuth } from '@/features/auth/auth-context'

const adminLinks = [['/admin', 'Dashboard', Gauge], ['/admin/bookings', 'Bookings', CalendarDays], ['/admin/calendar', 'Calendar', CalendarDays], ['/admin/tours', 'Tours', Map], ['/admin/destinations', 'Destinations', MapPin], ['/admin/cars', 'Cars', CarFront], ['/admin/drivers', 'Drivers', UsersRound]] as const

export function OperationsLayout({ driver = false }: { driver?: boolean }) {
  const { user, logout } = useAuth()
  const links = driver ? [['/driver', 'My trips', CalendarDays]] as const : adminLinks
  return <div className="min-h-screen bg-[#f4f5f2] lg:grid lg:grid-cols-[260px_1fr]">
    <aside className="border-b border-black/5 bg-ink p-5 text-white lg:min-h-screen lg:border-b-0">
      <div className="flex items-center gap-3 font-bold"><Mountain className="text-apricot-light" />Armenia Operations</div>
      <nav className="mt-7 flex gap-2 overflow-x-auto lg:grid">{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end className={({ isActive }) => cn('flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/8 hover:text-white', isActive && 'bg-white/12 text-white')}><Icon className="size-4" />{label}</NavLink>)}</nav>
    </aside>
    <section><header className="flex min-h-18 items-center justify-between border-b border-black/5 bg-white px-5 sm:px-8"><div><p className="text-sm text-black/50">Signed in as</p><p className="font-semibold">{user?.name}</p></div><button className="flex items-center gap-2 text-sm font-semibold text-forest" onClick={() => void logout()}><LogOut className="size-4" />Log out</button></header><main className="p-5 sm:p-8"><Outlet /></main></section>
  </div>
}
