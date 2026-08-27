import { Outlet, ScrollRestoration } from 'react-router-dom'
import { PublicFooter } from './PublicFooter'
import { PublicHeader } from './PublicHeader'

export function PublicLayout() { return <div className="page-shell"><PublicHeader /><main><Outlet /></main><PublicFooter /><ScrollRestoration /></div> }
