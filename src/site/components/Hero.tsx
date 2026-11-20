// Home hero (spec §4, approved — treat as finished): full-width dusk panorama, lake ripple
// on the water cut-out only, window glow, canvas flock, parallax. All motion is off for
// prefers-reduced-motion.
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FEATURED } from "../data/site";
import { IcPlay } from "./icons";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasFilm = !!FEATURED.film;

  useBirds(canvasRef, photoRef, heroRef);

  // Parallax on scroll (desktop only).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 860px)").matches) return;
    const ph = photoRef.current, copy = copyRef.current;
    if (!ph || !copy) return;
    const onScroll = () => {
      const y = Math.min(window.scrollY, 900);
      ph.style.translate = `0 ${y * 0.18}px`;
      copy.style.translate = `0 ${y * 0.08}px`;
      copy.style.opacity = String(1 - y / 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Water ripple used by the hero lake */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="ripple" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves={2} seed={3} result="n">
            <animate attributeName="baseFrequency" dur="14s" values="0.004 0.09;0.006 0.11;0.004 0.09" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale={14} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <section className="hero" aria-labelledby="hero-title" ref={heroRef}>
        <div className="hero-sky" />
        <div className="hero-photo" ref={photoRef}>
          <img src="/img/tasmee-panorama.webp" alt="Xen Lakeview Tasmee at dusk, seen across Jolshiri Lake" width={4443} height={2037} {...{ fetchpriority: "high" }} />
          <div className="hero-water" aria-hidden="true"><img src="/img/tasmee-panorama-water.webp" alt="" /></div>
          <div className="hero-glow" aria-hidden="true" />
        </div>
        <div className="hero-shade" />
        <canvas className="birds" aria-hidden="true" ref={canvasRef} />
        <div className="hero-tag fade-up"><span>Plot 038 · Road 504 · Sector 14</span><b>Jolshiri Abashon</b></div>

        <div className="wrap">
          <div className="hero-copy" ref={copyRef}>
            <p className="hero-presents fade-up">Xen Developments Ltd. presents Lakeview Tasmee</p>
            <h1 id="hero-title">
              <span className="line"><span>Wake up to</span></span>
              <span className="line"><span><em>200 feet of lake.</em></span></span>
              <span className="line"><span>Every floor.</span></span>
            </h1>
            <p className="hero-sub fade-up">Be a proud owner of an apartment in Jolshiri Abashon. Eight homes, one per floor, each with balconies facing the water. Booking is open now.</p>
            <div className="hero-ctas fade-up">
              <Link className="btn" to="/contact#visit">Book a sunset site visit</Link>
              {hasFilm ? (
                <Link className="btn btn--ghost" to="#film"><span className="play-dot"><IcPlay /></span>Watch the project film</Link>
              ) : (
                // DEVIATIONS.md A1: no film yet, so don't promise one.
                <Link className="btn btn--ghost" to="#film">See the project</Link>
              )}
            </div>
            <p className="hero-assure fade-up">Late handover? We pay you ৳40,000 every month. It's in your agreement.</p>
          </div>
        </div>

        <div className="hero-facts" aria-label="Lakeview Tasmee at a glance">
          <div className="wrap">
            <div><b>4 beds · 5 baths</b><small>7 balconies</small></div>
            <div><b>2,505 sft</b><small>Apartment (Type-A)</small></div>
            <div><b>8 homes only</b><small>One per floor</small></div>
            <div><b>200 ft lake</b><small>North-east facing</small></div>
            <div><b>৳5 lakh</b><small>Books your floor</small></div>
          </div>
        </div>
      </section>
    </>
  );
}

interface Bird { ox: number; oy: number; s: number; p: number }
interface Flock { t0: number; speed: number; fadeIn: number; cx: number; cy: number; birds: Bird[] }

/** A small flock that glides through the sky, left to right, then loops. The first flock is
 *  already beside the building on load; later ones enter from the left every 10–15 s.
 *  Ported from the prototype's birds(); pauses while the hero is off-screen. */
function useBirds(
  cvRef: React.RefObject<HTMLCanvasElement>,
  photoRef: React.RefObject<HTMLDivElement>,
  heroRef: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    const cv = cvRef.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let band = { top: 0, h: 0 };
    const size = () => {
      w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const c = cv.getBoundingClientRect(), p = photoRef.current ? photoRef.current.getBoundingClientRect() : c;
      band = { top: p.top - c.top, h: p.height };
    };
    size();
    window.addEventListener("resize", size);
    const startX = () => (window.innerWidth <= 860 ? -50 : w * 0.36);
    const headH = () => parseFloat(getComputedStyle(cv).getPropertyValue("--head-h")) || 0;
    const newFlock = (delay: number, intro = false): Flock => {
      const cx = intro ? w * (window.innerWidth <= 860 ? 0.12 : 0.5) : startX() - Math.random() * 80;
      const cy = Math.max(band.top + band.h * (intro ? 0.16 : 0.13 + Math.random() * 0.12), headH() + 40);
      return {
        t0: performance.now() + delay, speed: intro ? 60 : 38 + Math.random() * 18, fadeIn: intro ? 0.5 : 2, cx, cy,
        birds: Array.from({ length: 7 + Math.floor(Math.random() * 5) }, (_, i) => ({
          ox: -i * (10 + Math.random() * 8) + Math.random() * 6, oy: (Math.random() - 0.5) * 46 + (i % 2 ? 6 : -6),
          s: 2.6 + Math.random() * 2.4, p: Math.random() * 6.28,
        })),
      };
    };
    let flocks = [newFlock(300, true), newFlock(11000)];
    let raf = 0, visible = true, pausedAt = 0;
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.3; ctx.lineCap = "round";
      flocks = flocks.map((f) => {
        const age = (t - f.t0) / 1000;
        if (age < 0) return f;
        const x0 = f.cx + age * f.speed, y0 = f.cy + Math.sin(age * 0.6) * 8 - age * 1.5;
        if (x0 - 140 > w) return newFlock(4000 + Math.random() * 6000);
        const alpha = Math.min(1, age / f.fadeIn) * 0.62;
        ctx.strokeStyle = `rgba(38,28,44,${alpha})`;
        f.birds.forEach((b) => {
          const x = x0 + b.ox, y = y0 + b.oy + Math.sin(age * 1.7 + b.p) * 2;
          const flap = Math.sin(t / 150 + b.p) * b.s * 0.8;
          ctx.beginPath(); ctx.moveTo(x - b.s, y - flap); ctx.quadraticCurveTo(x - b.s * 0.4, y - flap * 0.2, x, y);
          ctx.quadraticCurveTo(x + b.s * 0.4, y - flap * 0.2, x + b.s, y - flap); ctx.stroke();
        });
        return f;
      });
      if (visible) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !visible) {
        visible = true;
        // Shift the timeline so flocks resume where they paused instead of jumping.
        const gap = performance.now() - pausedAt;
        flocks.forEach((f) => { f.t0 += gap; });
        raf = requestAnimationFrame(tick);
      } else if (!en.isIntersecting && visible) {
        visible = false; pausedAt = performance.now(); cancelAnimationFrame(raf);
      }
    });
    if (heroRef.current) io.observe(heroRef.current);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", size); };
  }, [cvRef, photoRef, heroRef]);
}
