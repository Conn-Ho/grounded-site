/**
 * Circuit traces that actually dock into the planet.
 *
 * Coordinates are chosen to align with HeroVisual:
 *   viewBox 520x520, planet center (260,260), radius 208 (== 0.4 * 520).
 * Each trace's first point sits exactly on the planet's visible rim, so
 * the traces read as cables soldered to the surface instead of floating
 * shapes pasted on top.
 *
 * Pulses flow in both directions (some outbound, some inbound) so the
 * planet feels like it's exchanging signals with the outside. Pure SVG
 * + SMIL; GPU-animated, zero React re-renders.
 */

const CX = 260;
const CY = 260;
const R = 208;
const RIM_OFFSET = 16; // how far the first bend sits outside the rim

type TraceSpec = {
  id: string;
  angle: number; // radians: 0 = right, -PI/2 = up
  end: [number, number]; // where the second bend lands (trace terminal)
  duration: number;
  delay: number;
  direction: "out" | "in";
};

function buildPath(angle: number, end: [number, number]) {
  const rim = [CX + R * Math.cos(angle), CY + R * Math.sin(angle)] as const;
  const bend = [
    CX + (R + RIM_OFFSET) * Math.cos(angle),
    CY + (R + RIM_OFFSET) * Math.sin(angle),
  ] as const;
  const fmt = (n: number) => n.toFixed(1);
  return `M ${fmt(rim[0])} ${fmt(rim[1])} L ${fmt(bend[0])} ${fmt(bend[1])} L ${end[0]} ${end[1]}`;
}

function reversePath(d: string): string {
  const tokens = d.trim().split(/\s+/);
  const pts: Array<[string, string]> = [];
  for (let i = 0; i < tokens.length; i += 3) {
    pts.push([tokens[i + 1], tokens[i + 2]]);
  }
  const rev = pts.slice().reverse();
  return `M ${rev[0][0]} ${rev[0][1]} ${rev
    .slice(1)
    .map(([x, y]) => `L ${x} ${y}`)
    .join(" ")}`;
}

const specs: TraceSpec[] = [
  { id: "tr", angle: -Math.PI * 0.25, end: [510, 100], duration: 3.6, delay: 0.0, direction: "out" },
  { id: "tl", angle: -Math.PI * 0.75, end: [10, 100],  duration: 4.2, delay: 1.1, direction: "in" },
  { id: "bl", angle:  Math.PI * 0.75, end: [10, 420],  duration: 3.8, delay: 2.0, direction: "out" },
  { id: "br", angle:  Math.PI * 0.25, end: [510, 420], duration: 4.5, delay: 0.5, direction: "in" },
  { id: "t",  angle: -Math.PI * 0.5 + 0.18, end: [340, 24], duration: 3.2, delay: 1.6, direction: "out" },
  { id: "b",  angle:  Math.PI * 0.5 - 0.22, end: [180, 506], duration: 3.4, delay: 0.9, direction: "in" },
];

const traces = specs.map((s) => {
  const forward = buildPath(s.angle, s.end);
  return {
    ...s,
    forward,
    pulsePath: s.direction === "in" ? reversePath(forward) : forward,
    rim: [CX + R * Math.cos(s.angle), CY + R * Math.sin(s.angle)] as const,
  };
});

export default function CircuitTraces() {
  return (
    <svg
      viewBox="0 0 520 520"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <filter id="trace-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="dock-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(232,165,63,0.55)" />
          <stop offset="70%" stopColor="rgba(232,165,63,0.08)" />
          <stop offset="100%" stopColor="rgba(232,165,63,0)" />
        </radialGradient>
      </defs>

      {/* trace lines (static) */}
      {traces.map((t) => (
        <path
          key={`line-${t.id}`}
          d={t.forward}
          stroke="var(--accent)"
          strokeOpacity="0.28"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* docking ports — glow halo + outer ring + bright core, pulsing */}
      {traces.map((t, i) => {
        const [rx, ry] = t.rim;
        const dur = 2.2 + (i % 3) * 0.5;
        const begin = `${(i * 0.35) % 2}s`;
        return (
          <g key={`dock-${t.id}`}>
            <circle cx={rx} cy={ry} r="18" fill="url(#dock-glow)">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={rx}
              cy={ry}
              r="5"
              fill="none"
              stroke="var(--accent)"
              strokeOpacity="0.6"
              strokeWidth="1"
            />
            <circle cx={rx} cy={ry} r="2.2" fill="var(--accent)">
              <animate
                attributeName="r"
                values="2;2.8;2"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur={`${dur}s`}
                begin={begin}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}

      {/* terminal pads at the far end of each trace */}
      {traces.map((t) => {
        const [ex, ey] = t.end;
        return (
          <g key={`term-${t.id}`}>
            <circle
              cx={ex}
              cy={ey}
              r="3.5"
              fill="none"
              stroke="var(--accent)"
              strokeOpacity="0.55"
              strokeWidth="1"
            />
            <circle cx={ex} cy={ey} r="1.4" fill="var(--accent)" opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2.6s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}

      {/* primary pulses */}
      {traces.map((t) => (
        <g key={`p-${t.id}`}>
          {/* glow trail */}
          <circle r="6" fill="var(--accent)" opacity="0" filter="url(#trace-glow)">
            <animateMotion
              dur={`${t.duration}s`}
              begin={`${t.delay}s`}
              repeatCount="indefinite"
              path={t.pulsePath}
            />
            <animate
              attributeName="opacity"
              values="0;0.4;0.4;0"
              keyTimes="0;0.2;0.8;1"
              dur={`${t.duration}s`}
              begin={`${t.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* bright head */}
          <circle r="2.6" fill="var(--accent)">
            <animateMotion
              dur={`${t.duration}s`}
              begin={`${t.delay}s`}
              repeatCount="indefinite"
              path={t.pulsePath}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.9;1"
              dur={`${t.duration}s`}
              begin={`${t.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* secondary fainter pulses on a few traces for density */}
      {traces.slice(0, 3).map((t) => (
        <circle
          key={`p2-${t.id}`}
          r="1.6"
          fill="var(--accent)"
          opacity="0.55"
        >
          <animateMotion
            dur={`${t.duration * 1.1}s`}
            begin={`${t.delay + t.duration * 0.55}s`}
            repeatCount="indefinite"
            path={t.pulsePath}
          />
        </circle>
      ))}

      {/* arrival flash at each docking port — repeats at trace period so
          a bright burst lands exactly as a pulse hits the rim */}
      {traces.map((t) => {
        const [rx, ry] = t.rim;
        // For outbound traces the pulse leaves at t=0, so arrival flash
        // is offset to line up with incoming pulses only. Inbound
        // traces flash when pulse arrives at rim (end of path).
        const flashBegin =
          t.direction === "in" ? t.delay + t.duration - 0.2 : t.delay - 0.05;
        return (
          <circle
            key={`flash-${t.id}`}
            cx={rx}
            cy={ry}
            r="3"
            fill="var(--accent)"
            opacity="0"
            filter="url(#trace-glow)"
          >
            <animate
              attributeName="r"
              values="3;12;3"
              keyTimes="0;0.4;1"
              dur="0.9s"
              begin={`${flashBegin}s;flash-${t.id}.end+${t.duration - 0.9}`}
              id={`flash-${t.id}`}
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0"
              keyTimes="0;0.3;1"
              dur="0.9s"
              begin={`${flashBegin}s;flash-${t.id}.end+${t.duration - 0.9}`}
            />
          </circle>
        );
      })}
    </svg>
  );
}
