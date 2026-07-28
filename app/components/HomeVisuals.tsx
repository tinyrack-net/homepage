import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/use-in-view.ts";

/**
 * Decorative, token-only SVG illustrations for the landing page, drawn as
 * isometric 2.5D scenes. Faces shade with the neutral surface ramp (top
 * `surface`, right `surface-muted`, left `surface-hover`) and every edge
 * keeps a 2px border stroke, so both themes stay legible for free.
 *
 * Each scene tells its section's story: servers slide into a framed rack and
 * boot (hero), a git graph laid on the floor merges into a repository box
 * (open source), a lit home with its own server while the cloud link is cut
 * (self-hosting), a messy pile resolving into one calm unit (simplicity),
 * and products sitting on one shared trace (the CTA band).
 *
 * Each illustration is its own scroll stage: the root `<svg>` carries
 * `hv-stage` and a `data-inview` flag from `useInView`, and every
 * `[data-hv-enter]` group plays its entrance (rise, drop, slot, pop, draw —
 * see app/styles/visuals.css) after its inline `--hv-delay`. Resting styles
 * are the finished artwork, so prerendered HTML and reduced-motion users see
 * the complete composition; ambient loops stay behind `motion-safe`.
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
  children,
  d,
  delayMs,
  fx,
  fy,
  h,
  inverse = false,
  w,
}: {
  anim?: string;
  children?: ReactNode;
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
      {children}
    </g>
  );
}

/** Concentric floor diamonds grounding a composition. */
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

function DotPattern({ id }: { id: string }) {
  return (
    <pattern height="18" id={id} patternUnits="userSpaceOnUse" width="18">
      <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
    </pattern>
  );
}

/* --- Hero: servers slide into a framed rack and boot. ------------------- */

const RACK_SLABS = [0, 1, 2, 3] as const;
const POWERED_SLAB = 1;
const RACK_VENTS = [8, 13, 18] as const;

export function RackVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 360");
  const ghost = isoFaces(147, 140, 110, 56, 24);

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-rack-dots" />
      </defs>
      <rect fill="url(#iso-rack-dots)" height="360" opacity="0.5" width="320" />

      <FloorRings cx={160} cy={310} delayMs={0} rings={[36, 54, 72]} />

      {/* Rack base. */}
      <IsoBox d={70} delayMs={140} fx={136} fy={332} h={10} w={128} />

      {/* Rear mounting rails rise before the servers arrive. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M98.5 290V88"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(300, "hv-draw", 350)}
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M242.3 263V61"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(360, "hv-draw", 350)}
      />

      {/* Servers slide into the frame, bottom-up, with vents and idle LEDs.
          One arrives powered. */}
      {RACK_SLABS.map((slab) => {
        const fy = 316 - slab * 44;
        const powered = slab === POWERED_SLAB;
        const detail = powered
          ? "stroke-tinyrack-border-inverse"
          : "stroke-tinyrack-border";

        return (
          <IsoBox
            anim="hv-iso-slot"
            d={56}
            delayMs={600 + slab * 80}
            fx={147}
            fy={fy}
            h={24}
            inverse={powered}
            key={slab}
            w={110}
          >
            {RACK_VENTS.map((vent) => (
              <path
                className={detail}
                d={`M156.5 ${fy - 5.5 - vent}L199.4 ${fy - 30.3 - vent}`}
                key={vent}
                strokeWidth="2"
              />
            ))}
            <circle
              className={
                powered ? "fill-tinyrack-success" : "fill-tinyrack-border"
              }
              cx="228"
              cy={fy - 58.8}
              r={powered ? 3.5 : 2.5}
            />
          </IsoBox>
        );
      })}

      {/* Front mounting rail overlays the mounted servers. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M147 318V116"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(420, "hv-draw", 350)}
      />

      {/* Top plate caps the frame. */}
      <IsoBox
        anim="hv-iso-drop"
        d={56}
        delayMs={500}
        fx={147}
        fy={116}
        h={8}
        w={110}
      />

      {/* The powered server's boot glow. */}
      <g data-hv-enter style={enterStyle(1050, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
          cx="228"
          cy="213.2"
          r="8"
          strokeWidth="2"
        />
      </g>

      {/* An empty slot waits for the next server. */}
      <g data-hv-enter style={enterStyle(1200, "hv-fade")}>
        {[ghost.left, ghost.right, ghost.top].map((points) => (
          <polygon
            className="stroke-tinyrack-border"
            key={points}
            points={points}
            strokeDasharray="4 6"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        ))}
      </g>

      {/* Uplink runs along the floor and out of frame. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M140 334L252.6 269"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(1100, "hv-draw", 400)}
      />
      <g data-hv-enter style={enterStyle(1300, "hv-fade")}>
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M140 334L252.6 269"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx="256.5"
          cy="266.7"
          r="4"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Open source: a git graph on the floor merges into the repository. -- */

const OS_MAIN_COMMITS = [
  [47.3, 158],
  [129.6, 110.5],
] as const;
const OS_BRANCH_COMMITS = [
  [101.7, 152],
  [127.6, 137],
] as const;

export function OpenSourceVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-os-dots" />
      </defs>
      <rect fill="url(#iso-os-dots)" height="200" opacity="0.5" width="320" />

      {/* Main line, laid along the iso axis. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M30 168L220.5 58"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(140, "hv-draw", 500)}
      />
      {/* A contribution forks off, runs beside it, and merges back. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M69 145.5C72.7 151.5 74.3 160.5 80 164.5"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(380, "hv-draw", 300)}
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M80 164.5L153.6 122"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(480, "hv-draw", 350)}
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M153.6 122C158 119.5 158.4 99.5 159.9 93"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(650, "hv-draw", 300)}
      />

      {/* Commits land along the lines. */}
      {[...OS_MAIN_COMMITS, ...OS_BRANCH_COMMITS].map(([cx, cy], index) => (
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx={cx}
          cy={cy}
          data-hv-enter
          key={`${cx}-${cy}`}
          r="3.5"
          strokeWidth="2"
          style={enterStyle(700 + index * 70, "hv-pop", 350)}
        />
      ))}

      {/* The merge lights up... */}
      <g data-hv-enter style={enterStyle(980, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-primary opacity-40 motion-safe:animate-pulse"
          cx="159.9"
          cy="93"
          r="9"
          strokeWidth="2"
        />
        <circle className="fill-tinyrack-primary" cx="159.9" cy="93" r="4.5" />
      </g>

      {/* ...and history flows into the repository. */}
      <FloorRings cx={246} cy={80} delayMs={600} rings={[24, 38]} />
      <IsoBox d={36} delayMs={750} fx={238} fy={72} h={20} w={48}>
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="267.1"
          cy="45.2"
          r="3"
        />
      </IsoBox>

      <g data-hv-enter style={enterStyle(1250, "hv-fade")}>
        <path
          className="hv-flow-slow stroke-tinyrack-border-strong opacity-60"
          d="M30 168L69 145.5"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
        <path
          className="hv-flow-slow stroke-tinyrack-border-strong opacity-60"
          d="M80 164.5L153.6 122"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M159.9 93L220.5 58"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Self-hosting: a lit home with its own server; the cloud link is cut. */

const HOUSE = {
  door: `${pt(135.1, 146.8)} ${pt(147.2, 139.8)} ${pt(147.2, 119.8)} ${pt(135.1, 126.8)}`,
  gable: `${pt(126, 116)} ${pt(77.5, 88)} ${pt(101.8, 80)}`,
  rightSlope: `${pt(126, 116)} ${pt(186.6, 81)} ${pt(162.4, 45)} ${pt(101.8, 80)}`,
  window: `${pt(163.6, 116.3)} ${pt(175.7, 109.3)} ${pt(175.7, 97.3)} ${pt(163.6, 104.3)}`,
};

export function SelfHostVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-host-dots" />
      </defs>
      <rect fill="url(#iso-host-dots)" height="200" opacity="0.5" width="320" />

      <FloorRings cx={146} cy={152} delayMs={0} rings={[34, 52, 70]} />

      {/* The house: walls rise, the roof settles, the window lights up. */}
      <IsoBox d={56} delayMs={200} fx={126} fy={152} h={36} w={70} />
      <g data-hv-enter style={enterStyle(400, "hv-iso-drop")}>
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
      <g data-hv-enter style={enterStyle(580, "hv-fade")}>
        <polygon
          className="fill-tinyrack-surface-muted stroke-tinyrack-border"
          points={HOUSE.door}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <polygon
          className="fill-tinyrack-success-surface stroke-tinyrack-border"
          points={HOUSE.window}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g data-hv-enter style={enterStyle(740, "hv-pop", 350)}>
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="169.7"
          cy="106.8"
          r="2"
        />
      </g>

      {/* The home server racked beside the house. */}
      <IsoBox
        anim="hv-iso-slot"
        d={26}
        delayMs={780}
        fx={238}
        fy={152}
        h={11}
        w={36}
      />
      <IsoBox
        anim="hv-iso-slot"
        d={26}
        delayMs={880}
        fx={238}
        fy={139}
        h={11}
        inverse
        w={36}
      >
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="259.8"
          cy="120.9"
          r="2.5"
        />
      </IsoBox>

      {/* Local links: the house feeds from its own hardware. */}
      <path
        className="stroke-tinyrack-border-strong opacity-60"
        d="M178 122L216 139"
        data-hv-enter
        strokeDasharray="4 6"
        strokeWidth="2"
        style={enterStyle(1000, "hv-fade")}
      />
      <IsoBox
        anim="hv-iso-drop"
        d={20}
        delayMs={700}
        fx={56}
        fy={168}
        h={14}
        w={20}
      />
      <path
        className="stroke-tinyrack-border-strong opacity-60"
        d="M74 158C88 154 96 148 106 142"
        data-hv-enter
        strokeDasharray="4 6"
        strokeWidth="2"
        style={enterStyle(940, "hv-fade")}
      />
      <g data-hv-enter style={enterStyle(1320, "hv-fade")}>
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M178 122L216 139"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>

      {/* The cloud stays out of the picture. */}
      <g data-hv-enter style={enterStyle(1060, "hv-fade")}>
        <path
          className="stroke-tinyrack-border opacity-60"
          d="M212 52h44a10 10 0 0 0 2.2-19.7A15 15 0 0 0 229 24a15 15 0 0 0-14.6 11.3A10 10 0 0 0 212 52Z"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-border opacity-60"
          d="M232 58C220 66 214 70 208 76"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
      </g>
      <path
        className="stroke-tinyrack-border-strong"
        d="M206 18L272 58"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(1180, "hv-draw", 300)}
      />
      <g data-hv-enter style={enterStyle(1280, "hv-fade")}>
        <path
          className="stroke-tinyrack-border-strong"
          d="M196 78l8 8M204 78l-8 8"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Simplicity: a messy pile resolves into one calm unit. --------------- */

const PILE_SLABS = [
  { fx: 66, fy: 162 },
  { fx: 76, fy: 151 },
  { fx: 60, fy: 140 },
  { fx: 72, fy: 129 },
] as const;

export function SimplicityVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-simple-dots" />
      </defs>
      <rect
        fill="url(#iso-simple-dots)"
        height="200"
        opacity="0.5"
        width="320"
      />

      {/* The pile: mismatched slabs, tangled wiring. */}
      {PILE_SLABS.map((slab, index) => (
        <IsoBox
          anim="hv-pop"
          d={36}
          delayMs={120 + index * 80}
          fx={slab.fx}
          fy={slab.fy}
          h={9}
          key={slab.fy}
          w={54}
        />
      ))}
      <g data-hv-enter style={enterStyle(470, "hv-fade")}>
        <path
          className="stroke-tinyrack-border opacity-60"
          d="M44 154C58 120 106 148 92 112S128 96 118 128"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-border opacity-60"
          d="M92 160C100 172 84 176 78 168"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
      </g>

      {/* One direction out of the mess. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M116 152L190.5 109"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(620, "hv-draw", 350)}
      />
      <g data-hv-enter style={enterStyle(820, "hv-fade")}>
        <path
          className="stroke-tinyrack-border-strong"
          d="M185.5 118.3L190.5 109L179.9 108.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>

      {/* The calm unit. */}
      <FloorRings cx={236} cy={152} delayMs={700} rings={[30, 46]} />
      <IsoBox d={56} delayMs={850} fx={210} fy={150} h={18} w={90} />
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
      <g data-hv-enter style={enterStyle(1200, "hv-fade")}>
        <path
          className="hv-flow-slow stroke-tinyrack-border-strong opacity-60"
          d="M116 152L190.5 109"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- CTA band: products on one shared trace. ----------------------------- */

const CIRCUIT_BOXES = [
  { d: 30, fx: 170, h: 16, w: 48 },
  { d: 28, fx: 390, h: 14, w: 40 },
  { d: 32, fx: 610, h: 18, w: 52 },
  { d: 28, fx: 830, h: 14, w: 40 },
] as const;
const CIRCUIT_LIVE = 2;
const CIRCUIT_VIAS = [100, 310, 530, 750] as const;

export function CircuitVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 960 96");

  return (
    <svg aria-hidden="true" {...stage}>
      {/* The shared trace with vias and terminals. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M40 62H920"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(80, "hv-draw", 600)}
      />
      <g data-hv-enter style={enterStyle(300, "hv-fade")}>
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
        {CIRCUIT_VIAS.map((cx) => (
          <circle
            className="fill-tinyrack-border"
            cx={cx}
            cy="62"
            key={cx}
            r="2.5"
          />
        ))}
      </g>

      {/* Products sit on the trace as small volumes, each with its own LED. */}
      {CIRCUIT_BOXES.map((box, index) => {
        const live = index === CIRCUIT_LIVE;
        const ledX = box.fx + RX * box.w * 0.7;
        const ledY = 70 - box.w * 0.35 - box.h / 2;

        return (
          <IsoBox
            d={box.d}
            delayMs={320 + index * 130}
            fx={box.fx}
            fy={70}
            h={box.h}
            inverse={live}
            key={box.fx}
            w={box.w}
          >
            {live ? (
              <g>
                <circle
                  className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
                  cx={ledX}
                  cy={ledY}
                  r="6.5"
                  strokeWidth="2"
                />
                <circle
                  className="fill-tinyrack-success motion-safe:animate-pulse"
                  cx={ledX}
                  cy={ledY}
                  r="3"
                />
              </g>
            ) : (
              <circle
                className="fill-tinyrack-border"
                cx={ledX}
                cy={ledY}
                r="2"
              />
            )}
          </IsoBox>
        );
      })}

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
