/**
 * Meteor-style scroll indicator — three staggered streaks falling with
 * glowing heads. Pure SVG + SMIL; no JS.
 */

type Streak = {
  x: number; // lateral offset from center
  delay: number;
  duration: number;
  length: number;
  opacity: number;
};

const streaks: Streak[] = [
  { x: 0, delay: 0, duration: 1.8, length: 28, opacity: 1 },
  { x: -4, delay: 0.4, duration: 2.2, length: 20, opacity: 0.65 },
  { x: 3, delay: 0.9, duration: 2.5, length: 14, opacity: 0.45 },
];

export default function MeteorScroll() {
  const W = 28;
  const H = 90;
  const START = -30;
  const END = H + 10;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden className="overflow-visible">
      <defs>
        {streaks.map((s, i) => (
          <linearGradient
            key={`g-${i}`}
            id={`trail-${i}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity={0.6 * s.opacity} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={s.opacity} />
          </linearGradient>
        ))}
      </defs>

      {streaks.map((s, i) => {
        const cx = W / 2 + s.x;
        return (
          <g key={i}>
            {/* trailing line */}
            <rect
              x={cx - 0.75}
              y={-s.length}
              width="1.5"
              height={s.length}
              fill={`url(#trail-${i})`}
              opacity="0"
            >
              <animate
                attributeName="y"
                values={`${START};${END - s.length}`}
                keyTimes="0;1"
                dur={`${s.duration}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.15;0.85;1"
                dur={`${s.duration}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
            </rect>
            {/* bright head */}
            <circle cx={cx} cy="0" r={1.5 * s.opacity + 0.6} fill="var(--accent)">
              <animate
                attributeName="cy"
                values={`${START + s.length};${END}`}
                dur={`${s.duration}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={`0;${s.opacity};${s.opacity};0`}
                keyTimes="0;0.2;0.8;1"
                dur={`${s.duration}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
            {/* soft glow around head */}
            <circle cx={cx} cy="0" r={4} fill="var(--accent)" opacity="0">
              <animate
                attributeName="cy"
                values={`${START + s.length};${END}`}
                dur={`${s.duration}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={`0;${0.25 * s.opacity};0`}
                keyTimes="0;0.5;1"
                dur={`${s.duration}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
