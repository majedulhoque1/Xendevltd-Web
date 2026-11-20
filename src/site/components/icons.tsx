// Inline SVG icons ported 1:1 from the prototype's layout.js `I` map.
type P = { className?: string };
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

export const IcChev = (p: P) => (
  <svg viewBox="0 0 12 12" {...stroke} aria-hidden="true" {...p}><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
);
export const IcBack = (p: P) => (
  <svg viewBox="0 0 16 16" {...stroke} aria-hidden="true" {...p}><path d="M10 3 5 8l5 5" /></svg>
);
export const IcPhone = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const IcWa = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
  </svg>
);
export const IcMail = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IcPin = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
export const IcCal = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const IcPlay = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M6 4v16l14-8z" /></svg>
);
export const IcMenu = (p: P) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...stroke} aria-hidden="true" {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IcDoc = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true" {...p}><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4M12 11v6m-3-3 3 3 3-3" /></svg>
);
