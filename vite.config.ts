import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    // Opt-in responsive images. `import hero from "@/assets/x.jpg?responsive"`
    // yields a picture object (AVIF/WebP/JPEG sources at four widths) for <Img>.
    // Imports without the flag stay plain URL strings, so existing call sites
    // are untouched.
    imagetools({
      defaultDirectives: (url) =>
        url.searchParams.has("responsive")
          ? new URLSearchParams({
              format: "avif;webp;jpg",
              w: "480;768;1200;1920",
              withoutEnlargement: "true",
              as: "picture",
            })
          : new URLSearchParams(),
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
