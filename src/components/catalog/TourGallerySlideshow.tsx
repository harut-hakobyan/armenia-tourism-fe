import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Media } from "@/types/domain";
import { cn } from "@/lib/cn";

interface TourGallerySlideshowProps {
  images: Media[];
  title: string;
  galleryLabel: string;
}

export function TourGallerySlideshow({
  images,
  title,
  galleryLabel,
}: TourGallerySlideshowProps) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const imageCount = images.length;
  const visibleActive = imageCount > 0 ? active % imageCount : 0;
  const activeImage = images[visibleActive];

  function show(index: number) {
    setActive((index + imageCount) % imageCount);
  }

  function move(direction: -1 | 1) {
    show(visibleActive + direction);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (imageCount < 2 || event.button !== 0) return;
    pointerStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
  }

  useEffect(() => {
    if (!expanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setExpanded(false);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    thumbnailRefs.current[visibleActive]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [visibleActive]);

  if (!activeImage) return null;

  const activeAlt =
    activeImage.alt_text ?? `${title} ${galleryLabel} ${visibleActive + 1}`;

  return (
    <>
      <div
        className="group w-full min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} ${galleryLabel}`}
      >
        <div
          className="relative aspect-[16/10] touch-pan-y overflow-hidden bg-stone sm:aspect-[16/9]"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
        >
          <img
            key={activeImage.id}
            src={activeImage.url}
            alt={activeAlt}
            className="size-full select-none object-cover"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

          <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            {visibleActive + 1} / {imageCount}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Open gallery fullscreen"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Maximize2 className="size-4" />
          </button>

          {imageCount > 1 && (
            <>
              <GalleryArrow direction="previous" onClick={() => move(-1)} />
              <GalleryArrow direction="next" onClick={() => move(1)} />
            </>
          )}
        </div>

        {imageCount > 1 && (
          <div className="flex w-full min-w-0 max-w-full gap-3 overflow-x-auto overscroll-x-contain p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((image, index) => (
              <button
                key={image.id}
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                type="button"
                onClick={() => show(index)}
                aria-label={`Show image ${index + 1} of ${imageCount}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-stone ring-offset-2 transition sm:h-20 sm:w-28",
                  index === visibleActive
                    ? "ring-2 ring-apricot"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                <img
                  src={image.url}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[70] flex max-h-dvh max-w-[100vw] items-center justify-center overflow-hidden bg-black/95 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} ${galleryLabel}`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
        >
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Close fullscreen gallery"
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-7 sm:top-7"
          >
            <X className="size-5" />
          </button>
          <p className="absolute left-5 top-5 text-sm font-bold text-white/70 sm:left-8 sm:top-8">
            {visibleActive + 1} / {imageCount}
          </p>
          <img
            key={activeImage.id}
            src={activeImage.url}
            alt={activeAlt}
            className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] select-none object-contain sm:max-h-[calc(100dvh-5rem)] sm:max-w-[calc(100vw-5rem)]"
            draggable={false}
          />
          {imageCount > 1 && (
            <>
              <GalleryArrow
                direction="previous"
                onClick={() => move(-1)}
                expanded
              />
              <GalleryArrow
                direction="next"
                onClick={() => move(1)}
                expanded
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

function GalleryArrow({
  direction,
  onClick,
  expanded = false,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  expanded?: boolean;
}) {
  const previous = direction === "previous";
  const Icon = previous ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${previous ? "Previous" : "Next"} image`}
      className={cn(
        "absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full text-white backdrop-blur transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        previous ? "left-3 sm:left-5" : "right-3 sm:right-5",
        expanded
          ? "size-11 bg-white/10 hover:bg-white/20 sm:size-13"
          : "size-10 bg-black/45 opacity-100 hover:bg-black/65 sm:size-12 sm:opacity-0 sm:group-hover:opacity-100",
      )}
    >
      <Icon className="size-5 sm:size-6" />
    </button>
  );
}
