/**
 * Renders the `Picture` object produced by vite-imagetools' `as: "picture"`
 * output format (see vite.config.ts's `?responsive` directive and
 * src/vite-env.d.ts). Shape verified directly against the installed
 * `imagetools-core`'s `pictureFormat()` (node_modules/imagetools-core/dist
 * /index.js): { sources: Record<format, srcsetString>, img: { src, w, h } }.
 *
 * `sources` keys already come back in the directive's format preference
 * order (e.g. avif, webp, jpg), which is also the order <source> elements
 * need to appear in for the browser to pick the best one it supports.
 */
export interface Picture {
  sources: Record<string, string>;
  img: { src?: string; w?: number; h?: number };
}

interface ArtDirection {
  media: string;
  src: Picture;
}

interface ImgProps {
  src: Picture;
  art?: ArtDirection[];
  alt: string;
  sizes?: string;
  priority?: boolean;
  tone?: string;
  className?: string;
}

const Img = ({ src, art, alt, sizes, priority, tone, className }: ImgProps) => (
  <picture>
    {art?.map((entry) =>
      Object.entries(entry.src.sources).map(([format, srcSet]) => (
        <source
          key={`${entry.media}-${format}`}
          media={entry.media}
          srcSet={srcSet}
          sizes={sizes}
          type={`image/${format}`}
        />
      ))
    )}
    {Object.entries(src.sources).map(([format, srcSet]) => (
      <source key={format} srcSet={srcSet} sizes={sizes} type={`image/${format}`} />
    ))}
    <img
      src={src.img.src}
      width={src.img.w}
      height={src.img.h}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      // @ts-expect-error -- fetchPriority is valid HTML but missing from
      // this project's React DOM typings version
      fetchpriority={priority ? "high" : undefined}
      decoding={priority ? "sync" : "async"}
      style={tone ? { backgroundColor: tone } : undefined}
    />
  </picture>
);

export default Img;
