// Schematic Jolshiri map and the to-scale lake cross-section, ported 1:1 from widgets.js.
const MONO = "IBM Plex Mono, monospace";
const SANS = "Manrope, sans-serif";

export function JolshiriMap() {
  return (
    <svg viewBox="0 0 600 400" role="img" aria-labelledby="mapT mapD">
      <title id="mapT">Where Lakeview Tasmee sits in Jolshiri Abashon</title>
      <desc id="mapD">Schematic map: the 300 ft Purbachal expressway runs along the north of Jolshiri, Madani Avenue enters from Gulshan in the south-west, and Lakeview Tasmee is on the lake in Sector 14 near Central Park.</desc>
      <rect width="600" height="400" fill="#14452f" />
      <g stroke="#1d5139" strokeWidth="1">
        {Array.from({ length: 13 }, (_, i) => <line key={"v" + i} x1={i * 50} y1="0" x2={i * 50} y2="400" />)}
        {Array.from({ length: 9 }, (_, i) => <line key={"h" + i} x1="0" y1={i * 50} x2="600" y2={i * 50} />)}
      </g>
      <path d="M150 92 L548 84 Q584 200 560 352 L220 372 Q160 300 150 92Z" fill="#1a4d35" stroke="#4fb36f" strokeWidth="1.5" strokeDasharray="5 5" />
      <path d="M0 62 L600 52" stroke="#e9d9b8" strokeWidth="10" strokeLinecap="round" opacity=".85" />
      <text x="16" y="40" fill="#e9d9b8" fontFamily={MONO} fontSize="12">300 FT PURBACHAL EXPRESSWAY</text>
      <path d="M0 330 Q120 300 218 262" stroke="#e9d9b8" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".85" />
      <text x="10" y="358" fill="#e9d9b8" fontFamily={MONO} fontSize="11">MADANI AVENUE</text>
      <text x="10" y="374" fill="#8d998f" fontFamily={MONO} fontSize="10">← Gulshan · US Embassy 6 km</text>
      <path d="M200 140 Q300 120 360 170 T520 150 Q540 230 470 250 T330 300 Q260 310 240 340" stroke="#5aa3d6" strokeWidth="12" fill="none" strokeLinecap="round" opacity=".75" />
      <circle cx="370" cy="230" r="34" fill="#2c6e3f" />
      <text x="370" y="226" textAnchor="middle" fill="#dff3e5" fontFamily={SANS} fontSize="11" fontWeight="700">Central</text>
      <text x="370" y="240" textAnchor="middle" fill="#dff3e5" fontFamily={SANS} fontSize="11" fontWeight="700">Park</text>
      <rect x="258" y="196" width="46" height="34" rx="4" fill="#3b3358" />
      <text x="281" y="217" textAnchor="middle" fill="#ecebf2" fontFamily={MONO} fontSize="11">CBD</text>
      <g className="map-pin">
        <circle cx="468" cy="186" r="22" fill="#d4ead9" opacity=".25">
          <animate attributeName="r" values="10;26;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".5;0;.5" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="468" cy="186" r="8" fill="#d4ead9" stroke="#14452f" strokeWidth="3" />
        <rect x="380" y="108" width="176" height="44" rx="8" fill="#d4ead9" />
        <text x="392" y="127" fill="#072014" fontFamily={SANS} fontSize="13" fontWeight="700">Lakeview Tasmee</text>
        <text x="392" y="143" fill="#072014" fontFamily={MONO} fontSize="10">PLOT 038 · RD 504 · SEC 14</text>
        <path d="M468 152 L468 176" stroke="#d4ead9" strokeWidth="2" />
      </g>
      <text x="300" y="392" textAnchor="middle" fill="#6f7d73" fontFamily={MONO} fontSize="10">JOLSHIRI ABASHON · SCHEMATIC, NOT TO SCALE</text>
    </svg>
  );
}

/** Cross-section to scale in front of the building: 30 ft green, 8 ft track, 200 ft lake.
 *  About 10 ft per storey (assumed, as in the prototype). */
export function LakeSectionSVG({ level = 3, light = true }: { level?: number; light?: boolean }) {
  const k = 1.9, base = 210, x0 = 70;
  const P = light
    ? { bg: "#f4f6f1", ground: "#cfd8d1", floor: "#ffffff", stroke: "#0f4d2f", hi: "#0f4d2f", label: "#5b665e", belt: "#3fa36a", track: "#d6bf98", lake: "#86b9d8", trees: "#2f7d4f", sight: "#0f4d2f", text: "#5b665e", lakeText: "#2f6f95", far: "#7a857d" }
    : { bg: "#0f1c15", ground: "#26352b", floor: "#33453a", stroke: "none", hi: "#d4ead9", label: "#8d998f", belt: "#4fb36f", track: "#d9c7a3", lake: "#5aa3d6", trees: "#2c6e3f", sight: "#d4ead9", text: "#b8c4bb", lakeText: "#9fd0f0", far: "#6f7d73" };
  const fy = (n: number) => base - n * 10 * k;
  const eyeY = fy(level) - 5 * k, gx = x0 + 30 * k, tx = gx + 8 * k, lx = tx, lx2 = tx + 200 * k;
  return (
    <svg viewBox="0 0 600 250" role="img" aria-label={`Cross-section: Level ${level} looks over 30 ft of green, an 8 ft walking track and the 200 ft lake`}>
      <rect width="600" height="250" fill={P.bg} />
      {Array.from({ length: 9 }, (_, n) => (
        <rect key={n} x="14" y={fy(n + 1)} width={x0 - 14} height={10 * k - 2}
          fill={n === level ? P.hi : n === 0 ? P.ground : P.floor}
          stroke={n === level || n === 0 ? "none" : P.stroke} strokeWidth="1" />
      ))}
      <text x="40" y={fy(9) - 6} textAnchor="middle" fill={P.label} fontFamily={MONO} fontSize="10">TASMEE</text>
      <text x={(14 + x0) / 2} y={fy(level + 1) + (10 * k - 2) / 2 + 3.5} textAnchor="middle" fill={light ? "#ffffff" : "#0f1c15"} fontFamily={MONO} fontSize="9" fontWeight="600">L{level}</text>
      <rect x={x0} y={base - 6} width={30 * k} height="6" fill={P.belt} />
      <rect x={gx} y={base - 4} width={8 * k} height="4" fill={P.track} />
      <path d={`M${lx} ${base} L${lx2} ${base}`} stroke={P.lake} strokeWidth="10" />
      <g fill={P.trees} opacity={light ? 0.85 : 1}><circle cx={x0 + 18} cy={base - 22} r="14" /><circle cx={x0 + 40} cy={base - 28} r="17" /></g>
      <line x1={x0} y1={eyeY} x2={lx2} y2={base - 4} stroke={P.sight} strokeWidth="1.5" strokeDasharray="5 4" />
      <circle cx={x0 + 2} cy={eyeY} r="4" fill={P.sight} />
      <g fontFamily={MONO} fontSize="10" fill={P.text}>
        <text x={x0 + 15 * k} y={base + 18} textAnchor="middle">30 FT</text>
        <text x={gx + 4 * k} y={base + 32} textAnchor="middle">8 FT</text>
        <text x={(lx + lx2) / 2} y={base + 18} textAnchor="middle" fill={P.lakeText}>200 FT JOLSHIRI LAKE</text>
        <text x={lx2} y={base + 32} textAnchor="end" fill={P.far}>FAR SHORE ≈ {30 + 8 + 200} FT</text>
      </g>
    </svg>
  );
}
