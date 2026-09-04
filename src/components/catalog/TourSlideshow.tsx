import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Media } from '@/types/domain'
import { cn } from '@/lib/cn'

interface TourSlideshowProps {
  title: string
  coverImage: Media | null
  gallery?: Media[]
  href?: string
  className?: string
  imageClassName?: string
  fallbackImage?: string
}

export function TourSlideshow({ title, coverImage, gallery, href, className, imageClassName, fallbackImage }: TourSlideshowProps) {
  const images = useMemo(() => {
    const unique = new Map<number, Media>()
    if (coverImage) unique.set(coverImage.id, coverImage)
    gallery?.forEach((image) => unique.set(image.id, image))
    return [...unique.values()]
  }, [coverImage, gallery])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStart = useRef<number | null>(null)
  const dragged = useRef(false)
  const visibleActive = images.length > 0 ? active % images.length : 0

  useEffect(() => {
    if (images.length < 2 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), 4500)
    return () => window.clearInterval(timer)
  }, [images.length, paused])

  function move(direction: -1 | 1) {
    setActive((visibleActive + direction + images.length) % images.length)
  }

  function pointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (images.length < 2 || event.button !== 0) return
    dragStart.current = event.clientX
    dragged.current = false
    setPaused(true)
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return
    const offset = event.clientX - dragStart.current
    setDragOffset(offset)
    if (Math.abs(offset) > 8) dragged.current = true
  }

  function finishDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return
    const offset = event.clientX - dragStart.current
    if (Math.abs(offset) > 45) move(offset < 0 ? 1 : -1)
    dragStart.current = null
    setDragOffset(0)
    setDragging(false)
    setPaused(false)
  }

  const slides = images.length > 0 ? images.map((image) => (
    <img key={image.id} src={image.url} alt={image.alt_text ?? title} draggable={false} className={cn('h-full min-w-full select-none object-cover', imageClassName)} />
  )) : fallbackImage ? <img src={fallbackImage} alt={title} draggable={false} className={cn('h-full min-w-full select-none object-cover', imageClassName)} /> : null

  const viewport = <div
    className="size-full touch-pan-y overflow-hidden"
    onPointerDown={pointerDown}
    onPointerMove={pointerMove}
    onPointerUp={finishDrag}
    onPointerCancel={finishDrag}
    onClick={(event) => {
      if (!dragged.current) return
      event.preventDefault()
      dragged.current = false
    }}
  >
    <div
      className={cn('flex size-full', !dragging && 'transition-transform duration-500 ease-out motion-reduce:transition-none')}
      style={{ transform: `translateX(calc(-${visibleActive * 100}% + ${dragOffset}px))` }}
    >{slides}</div>
  </div>

  return <div
    aria-label={`${title} image slideshow`}
    aria-roledescription="carousel"
    className={cn('relative overflow-hidden', className)}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
  >
    {href ? <Link to={href} aria-label={`View ${title}`} className="block size-full">{viewport}</Link> : viewport}
    {images.length > 1 && <>
      <button type="button" aria-label="Previous image" onClick={() => move(-1)} className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition hover:bg-black/65 focus-visible:opacity-100 group-hover:opacity-100"><ChevronLeft className="size-5" /></button>
      <button type="button" aria-label="Next image" onClick={() => move(1)} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition hover:bg-black/65 focus-visible:opacity-100 group-hover:opacity-100"><ChevronRight className="size-5" /></button>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">{images.map((image, index) => <span key={image.id} className={cn('h-1.5 rounded-full bg-white/60 shadow-sm transition-all', index === visibleActive ? 'w-5 bg-white' : 'w-1.5')} />)}</div>
    </>}
  </div>
}
