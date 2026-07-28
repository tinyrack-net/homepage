import type { CSSProperties } from "react";
import { useInView } from "@/lib/use-in-view.ts";

/**
 * Decorative, token-only SVG illustrations for the landing page, drawn as
 * isometric 2.5D volumes. Faces shade with the neutral surface ramp (top
 * `surface`, right `surface-muted`, left `surface-hover`) and every edge
 * keeps a 2px border stroke, so both themes stay legible for free.
 *
 * Each illustration is its own scroll stage: the root `<svg>` carries
 * `hv-stage` and a `data-inview` flag from `useInView`, and every
 * `[data-hv-enter]` group plays its entrance (rise, drop, pop, draw — see
 * app/styles/visuals.css) after its inline `--hv-delay`. Resting styles are
 * the finished artwork, so prerendered HTML and reduced-motion users see the
 * complete composition; ambient loops (flowing dashes, floating, LED pulses)
 * stay behind `motion-safe`.
 *
 * The set is themed around the brand values: the rack (hero), open source,
 * self-hosting, and simplicity, plus the circuit strip in the CTA band.
 */

type VisualProps = {
  className?: string;
};

/** Inline entrance timing consumed by the shared rules in visuals.css. */
function enterStyle(
  delayMs: number,
  anim?: string,
  durationMs?: number,
): CSSProperties {
  const style: Record<string, string> = { "--hv-delay": `${delayMs}ms` };
  if (anim) {
    style["--hv-anim"] = anim;
  }
  if (durationMs) {
    style["--hv-duration"] = `${durationMs}ms`;
  }
  return style as CSSProperties;
}

/** Root svg props for a stage-wrapped illustration. */
function useVisualStage(className: string | undefined, viewBox: string) {
  const { inView, ref } = useInView<SVGSVGElement>(0.3);

  return {
    className: className ? `hv-stage ${className}` : "hv-stage",
    "data-inview": inView,
    fill: "none",
    focusable: "false",
    ref,
    viewBox,
  } as const;
}

const RX = 0.866;

function pt(x: number, y: number): string {
  return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
}

/** Face polygons for an iso box whose front-bottom corner sits at (fx, fy). */
function isoFaces(fx: number, fy: number, w: number, d: number, h: number) {
  const ax = RX * w;
  const ay = -0.5 * w;
  const bx = -RX * d;
  const by = -0.5 * d;

  return {
    left: [
      pt(fx, fy),
      pt(fx + bx, fy + by),
      pt(fx + bx, fy + by - h),
      pt(fx, fy - h),
    ].join(" "),
    right: [
      pt(fx, fy),
      pt(fx + ax, fy + ay),
      pt(fx + ax, fy + ay - h),
      pt(fx, fy - h),
    ].join(" "),
    top: [
      pt(fx, fy - h),
      pt(fx + ax, fy + ay - h),
      pt(fx + ax + bx, fy + ay + by - h),
      pt(fx + bx, fy + by - h),
    ].join(" "),
  };
}

function IsoBox({
  anim = "hv-iso-rise",
  d,
  delayMs,
  fx,
  fy,
  h,
  inverse = false,
  w,
}: {
  anim?: string;
  d: number;
  delayMs: number;
  fx: number;
  fy: number;
  h: number;
  inverse?: boolean;
  w: number;
}) {
  const faces = isoFaces(fx, fy, w, d, h);
  const stroke = inverse
    ? "stroke-tinyrack-border-inverse"
    : "stroke-tinyrack-border";

  return (
    <g data-hv-enter style={enterStyle(delayMs, anim)}>
      <polygon
        className={
          inverse
            ? `fill-tinyrack-surface-inverse opacity-90 ${stroke}`
            : `fill-tinyrack-surface-hover ${stroke}`
        }
        points={faces.left}
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <polygon
        className={
          inverse
            ? `fill-tinyrack-surface-inverse opacity-95 ${stroke}`
            : `fill-tinyrack-surface-muted ${stroke}`
        }
        points={faces.right}
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <polygon
        className={
          inverse
            ? `fill-tinyrack-surface-inverse ${stroke}`
            : `fill-tinyrack-surface ${stroke}`
        }
        points={faces.top}
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </g>
  );
}

/** Concentric floor diamonds centred under a composition. */
function FloorRings({
  cx,
  cy,
  delayMs,
  rings,
}: {
  cx: number;
  cy: number;
  delayMs: number;
  rings: readonly number[];
}) {
  return (
    <g data-hv-enter style={enterStyle(delayMs, "hv-fade")}>
      {rings.map((r, index) => (
        <polygon
          className="stroke-tinyrack-border"
          key={r}
          opacity={0.7 - index * 0.2}
          points={[
            pt(cx - r * RX * 2, cy),
            pt(cx, cy - r),
            pt(cx + r * RX * 2, cy),
            pt(cx, cy + r),
          ].join(" ")}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      ))}
    </g>
  );
}

const TOWER_SLABS = [0, 1, 2, 3, 4] as const;
const POWERED_SLAB = 2;

/** An isometric rack tower with one powered slab — the hero image. */
export function RackVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 360");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <pattern
          height="18"
          id="iso-rack-dots"
          patternUnits="userSpaceOnUse"
          width="18"
        >
          <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect fill="url(#iso-rack-dots)" height="360" opacity="0.5" width="320" />

      <FloorRings cx={164} cy={300} delayMs={0} rings={[36, 56, 76]} />

      {/* Rack tower: five slabs rise and settle, one arrives powered. */}
      {TOWER_SLABS.map((slab) => (
        <IsoBox
          d={64}
          delayMs={240 + slab * 90}
          fx={140}
          fy={328 - slab * 36}
          h={26}
          inverse={slab === POWERED_SLAB}
          key={slab}
          w={120}
        />
      ))}

      {/* Status aperture on the powered slab's right face. */}
      <g data-hv-enter style={enterStyle(760, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
          cx="218"
          cy="198"
          r="8"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="218"
          cy="198"
          r="4"
        />
      </g>

      {/* Riser: drafted route, then pulses climb it. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M262 306V96"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(880, "hv-draw", 450)}
      />
      <g data-hv-enter style={enterStyle(1120, "hv-fade")}>
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M262 306V96"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx="262"
          cy="312"
          r="4"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-border-strong"
          d="M256 104L262 92L268 104"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

const STACK_SLABS = [0, 1, 2] as const;

/** Contributions dropping onto a shared plate and merging into a stack. */
export function OpenSourceVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <pattern
          height="18"
          id="iso-os-dots"
          patternUnits="userSpaceOnUse"
          width="18"
        >
          <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect fill="url(#iso-os-dots)" height="200" opacity="0.5" width="320" />

      {/* The shared repository plate. */}
      <IsoBox d={84} delayMs={160} fx={120} fy={168} h={12} w={140} />

      {/* Merged contributions stack on the plate; the tip arrives live. */}
      {STACK_SLABS.map((slab) => (
        <IsoBox
          d={40}
          delayMs={380 + slab * 90}
          fx={150}
          fy={132 - slab * 14}
          h={10}
          inverse={slab === STACK_SLABS.length - 1}
          key={slab}
          w={64}
        />
      ))}

      {/* Incoming contributions drop toward the stack. */}
      <IsoBox
        anim="hv-iso-drop"
        d={26}
        delayMs={720}
        fx={82}
        fy={92}
        h={20}
        w={26}
      />
      <IsoBox
        anim="hv-iso-drop"
        d={26}
        delayMs={840}
        fx={248}
        fy={78}
        h={20}
        w={26}
      />
      <g data-hv-enter style={enterStyle(980, "hv-fade")}>
        <path
          className="stroke-tinyrack-border-strong opacity-60"
          d="M96 88C110 74 130 68 152 76"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-border-strong opacity-60"
          d="M242 74C224 58 196 58 176 72"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
      </g>

      {/* Plate aperture and the merge glow. */}
      <g data-hv-enter style={enterStyle(1080, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
          cx="216"
          cy="106"
          r="8"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="216"
          cy="106"
          r="4"
        />
      </g>

      {/* Quiet inflow along the floor. */}
      <g data-hv-enter style={enterStyle(1160, "hv-fade")}>
        <path
          className="hv-flow-slow stroke-tinyrack-border-strong opacity-60"
          d="M20 176H96"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* House geometry: an iso box with a gabled roof. Front-bottom corner F, box
   w=70 d=56 h=36, ridge height 22 above the top face, ridge running along the
   width axis. All corner coordinates below derive from those numbers. */
const HOUSE = {
  door: `${pt(135.1, 146.8)} ${pt(147.2, 139.8)} ${pt(147.2, 119.8)} ${pt(135.1, 126.8)}`,
  gable: `${pt(126, 116)} ${pt(77.5, 88)} ${pt(101.8, 80)}`,
  rightSlope: `${pt(126, 116)} ${pt(186.6, 81)} ${pt(162.4, 45)} ${pt(101.8, 80)}`,
};

/** A home with its own glowing server, devices docking over local links. */
export function SelfHostVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <pattern
          height="18"
          id="iso-host-dots"
          patternUnits="userSpaceOnUse"
          width="18"
        >
          <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect fill="url(#iso-host-dots)" height="200" opacity="0.5" width="320" />

      <FloorRings cx={146} cy={152} delayMs={0} rings={[34, 52, 70]} />

      {/* The house: walls rise, the roof settles on top. */}
      <IsoBox d={56} delayMs={220} fx={126} fy={152} h={36} w={70} />
      <g data-hv-enter style={enterStyle(420, "hv-iso-drop")}>
        <polygon
          className="fill-tinyrack-surface-hover stroke-tinyrack-border"
          points={HOUSE.gable}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <polygon
          className="fill-tinyrack-surface stroke-tinyrack-border"
          points={HOUSE.rightSlope}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g data-hv-enter style={enterStyle(600, "hv-fade")}>
        <polygon
          className="fill-tinyrack-surface-muted stroke-tinyrack-border"
          points={HOUSE.door}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>

      {/* The server light glowing inside the home. */}
      <g data-hv-enter style={enterStyle(1040, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
          cx="168.4"
          cy="107.7"
          r="8"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="168.4"
          cy="107.7"
          r="4"
        />
      </g>

      {/* Personal devices dock to the house over local links. */}
      <IsoBox
        anim="hv-iso-drop"
        d={22}
        delayMs={700}
        fx={226}
        fy={160}
        h={16}
        w={22}
      />
      <IsoBox
        anim="hv-iso-drop"
        d={20}
        delayMs={820}
        fx={56}
        fy={168}
        h={14}
        w={20}
      />
      <g data-hv-enter style={enterStyle(940, "hv-fade")}>
        <path
          className="stroke-tinyrack-border-strong opacity-60"
          d="M224 146C210 138 200 138 190 132"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-border-strong opacity-60"
          d="M72 156C88 152 96 148 106 142"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

const TANGLE_BOXES = [
  { d: 20, fx: 66, fy: 150, h: 18, w: 28 },
  { d: 18, fx: 98, fy: 126, h: 14, w: 22 },
  { d: 16, fx: 52, fy: 108, h: 12, w: 20 },
] as const;

/** A scattered pile resolving into one calm block. */
export function SimplicityVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <pattern
          height="18"
          id="iso-simple-dots"
          patternUnits="userSpaceOnUse"
          width="18"
        >
          <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect
        fill="url(#iso-simple-dots)"
        height="200"
        opacity="0.5"
        width="320"
      />

      {/* The scattered pile: many parts, tangled wiring. */}
      {TANGLE_BOXES.map((box, index) => (
        <IsoBox
          anim="hv-pop"
          d={box.d}
          delayMs={120 + index * 110}
          fx={box.fx}
          fy={box.fy}
          h={box.h}
          key={box.fx}
          w={box.w}
        />
      ))}
      <path
        className="stroke-tinyrack-border opacity-60"
        d="M40 162C74 122 38 104 82 96S122 138 98 152"
        data-hv-enter
        pathLength={100}
        strokeDasharray="4 6"
        strokeWidth="2"
        style={enterStyle(420, "hv-fade")}
      />

      {/* Everything converges... */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M112 118C136 108 148 112 166 122"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(560, "hv-draw", 400)}
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M104 148C130 150 150 144 176 139"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(640, "hv-draw", 400)}
      />

      {/* ...into one calm block. */}
      <g className="hv-float">
        <IsoBox d={56} delayMs={820} fx={210} fy={150} h={18} w={90} />
        <g data-hv-enter style={enterStyle(1080, "hv-pop", 400)}>
          <circle
            className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
            cx="272"
            cy="105"
            r="8"
            strokeWidth="2"
          />
          <circle
            className="fill-tinyrack-success motion-safe:animate-pulse"
            cx="272"
            cy="105"
            r="4"
          />
        </g>
      </g>
    </svg>
  );
}

const CIRCUIT_BOXES = [180, 400, 620, 840] as const;
const CIRCUIT_LIVE = 2;

/** Products as small volumes on one shared trace — the CTA band strip. */
export function CircuitVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 960 96");

  return (
    <svg aria-hidden="true" {...stage}>
      {/* The shared trace. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M40 62H920"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(80, "hv-draw", 600)}
      />
      <g data-hv-enter style={enterStyle(200, "hv-fade")}>
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx="40"
          cy="62"
          r="4"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx="920"
          cy="62"
          r="4"
          strokeWidth="2"
        />
      </g>

      {/* Products sit on the trace as small volumes. */}
      {CIRCUIT_BOXES.map((fx, index) => (
        <IsoBox
          d={30}
          delayMs={320 + index * 130}
          fx={fx}
          fy={70}
          h={16}
          inverse={index === CIRCUIT_LIVE}
          key={fx}
          w={44}
        />
      ))}
      <g data-hv-enter style={enterStyle(900, "hv-pop", 400)}>
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="646.7"
          cy="46.5"
          r="3.5"
        />
      </g>

      {/* Value flows across the whole band. */}
      <g data-hv-enter style={enterStyle(1050, "hv-fade")}>
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M40 62H920"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
