import { cn } from "@/lib/utils";

interface FramedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * Frames a portrait render without cutting off any of the building. Every
 * Xen render is a tall tower (aspect ~0.6–0.9), but the site's image boxes
 * are landscape (2:1, 3:2, 4:3) — a plain `object-cover` there crops the
 * roofline and the ground off a real photo.
 *
 * A blurred, scaled `object-cover` copy of the same image fills the frame
 * as a backdrop, so the box is never letterboxed with dead space, while the
 * real image sits centred on top at `object-contain`, shown whole.
 *
 * Sized by a parent that sets aspect-ratio / rounded corners / overflow —
 * this component fills that box via `absolute inset-0`. Purely visual: it
 * makes no assumption about interactivity. Wrap it in a `<button>` when
 * nothing else shares the frame (see the Gallery in ProjectDetail), or
 * overlay a dedicated expand control when it shares space with other
 * clickable elements (see the Hero in ProjectDetail).
 */
const FramedImage = ({ src, alt, className, priority }: FramedImageProps) => (
  <div className={cn("absolute inset-0", className)}>
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
      loading={priority ? "eager" : "lazy"}
    />
    <div className="absolute inset-0 bg-black/20" />
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-contain"
      loading={priority ? "eager" : "lazy"}
    />
  </div>
);

export default FramedImage;
