import { useEffect, useRef, useState } from "react";
import { IcPlay } from "./icons";

interface Props {
  /** Images for the cross-fading reel (up to 4). */
  reel?: string[];
  /** MP4 URL. When empty and no YouTube id, the reel plays with no play button (DEVIATIONS.md A1). */
  video?: string;
  youtube?: string;
  /** Still shown behind a YouTube overlay. */
  poster?: string;
  posterFallback?: string;
  title: string;
  sub: string;
  /** Right-hand meta, e.g. "Project film · 2:00" or "YouTube". Only shown with a playable source. */
  aside?: string;
  label: string;
  /** Vertical (9:16) film: the frame becomes a portrait card instead of 16:9. */
  portrait?: boolean;
  /** Silent clip: autoplays muted and loops, with no controls. Pauses when off-screen. */
  loop?: boolean;
}

export function Film({ reel = [], video, youtube, poster, posterFallback, title, sub, aside, label, portrait, loop }: Props) {
  const [playing, setPlaying] = useState(false);
  const loopRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Silent loop: play only while on screen. Reduced-motion visitors get controls instead of autoplay.
  useEffect(() => {
    const v = loopRef.current;
    if (!loop || !v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { v.controls = true; return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [loop]);

  const playable = !!video || !!youtube;
  const meta = (
    <span className="film-meta">
      <span><b>{title}</b><small>{sub}</small></span>
      {playable && aside && <small>{aside}</small>}
    </span>
  );

  if (loop && video) {
    return (
      <div className={portrait ? "film film--portrait" : "film"}>
        <video ref={loopRef} src={video} poster={poster} muted loop playsInline preload="auto" autoPlay={!reduceMotion} aria-label={label} />
      </div>
    );
  }

  return (
    <div className={portrait ? "film film--portrait" : "film"}>
      {reel.length > 0 && (
        <div className="reel" aria-hidden="true">{reel.slice(0, 4).map((src) => <img key={src} src={src} alt="" loading="lazy" />)}</div>
      )}
      {poster && (
        <img
          src={poster}
          alt=""
          loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { if (posterFallback && !e.currentTarget.src.endsWith(posterFallback)) e.currentTarget.src = posterFallback; }}
        />
      )}
      {playing && video && <video src={video} poster={poster} controls autoPlay playsInline />}
      {playing && youtube && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      )}
      {!playing && (playable ? (
        <button className="film-overlay" type="button" aria-label={label} onClick={() => setPlaying(true)}>
          <span className="film-play"><IcPlay /></span>
          {meta}
        </button>
      ) : (
        <div className="film-overlay" style={{ cursor: "default" }}>{meta}</div>
      ))}
    </div>
  );
}
