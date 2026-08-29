import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const titles:Record<string,string>={'/':'Explore Armenia Your Way','/tours':'Private & Group Tours in Armenia','/destinations':'Destinations in Armenia','/cars':'Private Cars and Drivers','/airport-transfer':'Zvartnots Airport Transfer','/private-driver':'Private Driver in Armenia','/build-your-trip':'Build Your Armenia Trip','/booking':'Book Your Armenia Adventure','/about':'About Armenia Journeys','/contact':'Contact Us','/faq':'Armenia Travel FAQ'}
export function RouteMeta(){const {pathname}=useLocation();useEffect(()=>{const base=titles[pathname]??(pathname.startsWith('/tours/')?'Armenia Tour':pathname.startsWith('/destinations/')?'Armenia Destination':'Armenia Journeys');document.title=`${base} | Armenia Journeys`},[pathname]);return null}
