import { useEffect, useRef, useState, type TouchEvent } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxState {
  images: LightboxImage[];
  index: number;
}

/**
 * Shared full-screen image viewer. Extracted from what used to be two
 * byte-for-byte copies of this same markup and Escape/scroll-lock effect
 * (ProjectsOverview.tsx and ProjectsCategory.tsx) — one implementation now,
 * plus arrow-key stepping through a gallery and focus returning to whatever
 * triggered it, which neither copy had.
 *
 * Usage:
 *   const lightbox = useLightbox();
 *   <button onClick={(e) => lightbox.open([{ src, alt }], 0, e.currentTarget)}>...
 *   {lightbox.state && <Lightbox {...lightbox} />}
 */
export function useLightbox() {
  const [state, setState] = useState<LightboxState | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = (images: LightboxImage[], index = 0, trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    setState({ images, index });
  };

  const close = () => {
    setState(null);
    triggerRef.current?.focus?.();
    triggerRef.current = null;
  };

  const setIndex = (index: number) => setState((s) => (s ? { ...s, index } : s));

  return { state, open, close, setIndex };
}

interface LightboxProps {
  state: LightboxState;
  close: () => void;
  setIndex: (index: number) => void;
}

// Minimum horizontal drag (px) before a touch gesture counts as a swipe
// rather than a tap or an attempt to scroll.
const SWIPE_THRESHOLD = 50;

const Lightbox = ({ state, close, setIndex }: LightboxProps) => {
  const { images, index } = state;
  const image = images[index];
  const hasMultiple = images.length > 1;
  const touchStartX = useRef<number | null>(null);

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (hasMultiple && e.key === "ArrowRight") next();
      if (hasMultiple && e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, hasMultiple]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) next();
    else if (delta < -SWIPE_THRESHOLD) prev();
    touchStartX.current = null;
  };

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={close}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        aria-label="Close"
        className="absolute top-4 right-4 p-2 rounded-full bg-secondary/80 hover:bg-secondary text-foreground transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-secondary/80 hover:bg-secondary text-foreground transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-secondary/80 hover:bg-secondary text-foreground transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
        />
        {image.alt && <p className="mt-4 text-center text-lg font-serif text-foreground">{image.alt}</p>}
        {image.caption && (
          <p className="mt-1.5 text-center text-sm text-muted-foreground max-w-xl leading-relaxed">
            {image.caption}
          </p>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
