import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
// Public routes are prerendered at build time (scripts/prerender.mjs); hydrate those so
// crawlers and first paint get real HTML. Admin and unknown routes render client-side.
if (root.firstElementChild) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
