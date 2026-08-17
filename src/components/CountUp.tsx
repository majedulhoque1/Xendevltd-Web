import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  duration?: number;
  className?: string;
}

// Parses "15+", "500+", "100%" etc. and animates the numeric portion.
const CountUp = ({ value, duration = 1.5, className }: CountUpProps) => {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2], 10) : 0;
  const suffix = match?.[3] ?? "";
  const hasMatch = !!match;

  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  // Native IntersectionObserver — triggers as soon as any part of the element
  // is visible, so it fires reliably even when it starts partly below the fold
  // on short mobile viewports.
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0, rootMargin: "0px 0px 150px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView || !hasMatch) return;
    let raf = 0;
    const start = performance.now();
    const ms = duration * 1000;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setCount(t >= 1 ? target : Math.round(target * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, hasMatch]);

  if (!match) {
    return <span ref={ref} className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export default CountUp;
