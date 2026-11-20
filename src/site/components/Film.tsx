import { useState } from "react";
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
}

export function Film({ reel = [], video, youtube, poster, posterFallback, title, sub, aside, label }: Props) {
  const [playing, setPlaying] = useState(false);
  const playable = !!video || !!youtube;
  const meta = (
    <span className="film-meta">
      <span><b>{title}</b><small>{sub}</small></span>
      {playable && aside && <small>{aside}</small>}
    </span>
  );

  return (
    <div className="film">
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
      {playing && video && <video src={video} controls autoPlay playsInline />}
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
