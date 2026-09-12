import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

/**
 * Full-screen embed of the exported Godot Web build (public/walkthrough-app/).
 * An iframe, not a direct script include, so the WASM/canvas runtime is fully
 * isolated from the site's own React tree and global styles -- and, more to
 * the point, so the ~40MB engine payload is only ever requested when a
 * visitor actually opens this route, never on the project page itself.
 */
const Walkthrough = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = "3D Walkthrough — Xen Lakeview Tasmee";
    return () => {
      document.title = "Xen Developments";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-ink">
      <Link
        to="/projects/xen-lakeview-tasmee"
        className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm text-white/70">
            Loading the walkthrough — first load is roughly 40MB.
          </p>
        </div>
      )}

      <iframe
        title="Xen Lakeview Tasmee — 3D Walkthrough"
        src="/walkthrough-app/index.html"
        onLoad={() => setLoaded(true)}
        allow="fullscreen; autoplay"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
};

export default Walkthrough;
