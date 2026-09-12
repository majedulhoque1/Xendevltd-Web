/// <reference types="vite/client" />

/**
 * `?responsive` imports are handled by vite-imagetools (see vite.config.ts) and
 * resolve to a picture object rather than a URL string.
 */
declare module "*?responsive" {
  const picture: import("@/components/ui/Img").Picture;
  export default picture;
}
