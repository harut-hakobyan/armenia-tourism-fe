import { Outlet, ScrollRestoration } from 'react-router-dom'
import { PublicFooter } from './PublicFooter'
import { PublicHeader } from './PublicHeader'
import { RouteMeta } from './RouteMeta'

export function PublicLayout() { return <div className="page-shell"><RouteMeta /><PublicHeader /><main><Outlet /></main><PublicFooter /><ScrollRestoration /></div> }
