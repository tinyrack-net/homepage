import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/use-in-view.ts";

/**
 * Decorative, token-only SVG illustrations for the landing page, drawn as
 * isometric 2.5D scenes. Every line sits on the two iso floor axes
 * (slope ±0.577) or is vertical, faces shade with a three-step surface ramp
 * (top `surface`, right `surface-hover`, left `surface-selected`), objects
 * cast a flat diamond shadow, and every edge keeps a 2px border stroke, so
 * both themes stay legible for free.
 *
 * Each scene tells its section's story: servers slide into a four-post rack
 * frame and boot (hero), an axis-aligned git graph on the floor merges into
 * the repository box (open source), a lit home wired to its own server while
 * the cloud link is cut (self-hosting), a crooked pile resolving into one
 * calm unit along a single floor line (simplicity), and products on iso pads
 * joined by one ground-level trace (the CTA band).
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

/** Floor diamond of an iso footprint whose front corner sits at (fx, fy). */
function baseDiamond(fx: number, fy: number, w: number, d: number): string {
  const ax = RX * w;
  const ay = -0.5 * w;
  const bx = -RX * d;
  const by = -0.5 * d;

  return [
    pt(fx, fy),
    pt(fx + ax, fy + ay),
    pt(fx + ax + bx, fy + ay + by),
    pt(fx + bx, fy + by),
  ].join(" ");
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

/** A line lying on a box's right face, along the width axis at height t. */
function rightFaceLine(
  fx: number,
  fy: number,
  u0: number,
  u1: number,
  t: number,
): string {
  const sx = fx + RX * u0;
  const sy = fy - 0.5 * u0 - t;
  const ex = fx + RX * u1;
  const ey = fy - 0.5 * u1 - t;

  return `M${pt(sx, sy)}L${pt(ex, ey)}`;
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
            ? `fill-tinyrack-surface-inverse opacity-80 ${stroke}`
            : `fill-tinyrack-surface-selected ${stroke}`
        }
        points={faces.left}
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <polygon
        className={
          inverse
            ? `fill-tinyrack-surface-inverse opacity-90 ${stroke}`
            : `fill-tinyrack-surface-hover ${stroke}`
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

/** Flat diamond shadow grounding an iso footprint. */
function IsoShadow({
  d,
  delayMs,
  expand = 6,
  fx,
  fy,
  w,
}: {
  d: number;
  delayMs: number;
  expand?: number;
  fx: number;
  fy: number;
  w: number;
}) {
  return (
    <polygon
      className="fill-tinyrack-border"
      data-hv-enter
      opacity="0.3"
      points={baseDiamond(fx, fy + expand, w + 2 * expand, d + 2 * expand)}
      style={enterStyle(delayMs, "hv-fade")}
    />
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

/* --- Hero: servers slide into a four-post rack frame and boot. ----------- */

/* Rack footprint: front corner (150, 322), w 110, d 56. Corner posts sit at
   front (150, 322), right (245.3, 267), left (101.5, 294), rear (196.8, 239)
   and reach the top plate resting at fy 166. */

const RACK_SLABS = [0, 1, 2, 3] as const;
const POWERED_SLAB = 1;
const RACK_VENTS = [8, 14, 20] as const;

export function RackVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 360");
  const ghost = isoFaces(150, 194, 110, 56, 26);

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-rack-dots" />
      </defs>
      <rect fill="url(#iso-rack-dots)" height="360" opacity="0.5" width="320" />

      <FloorRings cx={172} cy={302} delayMs={0} rings={[40, 58, 76]} />
      <IsoShadow d={64} delayMs={100} fx={146} fy={340} w={124} />

      {/* Rack base plate. */}
      <IsoBox d={64} delayMs={160} fx={146} fy={334} h={10} w={124} />

      {/* Rear mounting posts rise before the servers arrive. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M196.8 239V72.7"
        data-hv-enter
        pathLength={100}
        strokeWidth="3"
        style={enterStyle(280, "hv-draw", 350)}
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M101.5 294V140.3"
        data-hv-enter
        pathLength={100}
        strokeWidth="3"
        style={enterStyle(340, "hv-draw", 350)}
      />

      {/* Servers slide into the frame, bottom-up, nearly touching like real
          rack units. One arrives powered. */}
      {RACK_SLABS.map((slab) => {
        const fy = 322 - slab * 32;
        const powered = slab === POWERED_SLAB;
        const detail = powered
          ? "stroke-tinyrack-border-inverse"
          : "stroke-tinyrack-border-strong";

        return (
          <IsoBox
            anim="hv-iso-slot"
            d={56}
            delayMs={500 + slab * 110}
            fx={150}
            fy={fy}
            h={26}
            inverse={powered}
            key={slab}
            w={110}
          >
            {RACK_VENTS.map((vent) => (
              <path
                className={detail}
                d={rightFaceLine(150, fy, 10, 62, vent)}
                key={vent}
                strokeWidth="2"
              />
            ))}
            <circle
              className={
                powered ? "fill-tinyrack-success" : "fill-tinyrack-border"
              }
              cx="233.1"
              cy={fy - 62}
              r={powered ? 3.5 : 2.5}
            />
          </IsoBox>
        );
      })}

      {/* An empty slot waits for the next server. */}
      <g data-hv-enter style={enterStyle(1000, "hv-fade")}>
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

      {/* Front posts overlay the mounted servers. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M245.3 267V108.7"
        data-hv-enter
        pathLength={100}
        strokeWidth="3"
        style={enterStyle(400, "hv-draw", 350)}
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M150 322V166"
        data-hv-enter
        pathLength={100}
        strokeWidth="3"
        style={enterStyle(460, "hv-draw", 350)}
      />

      {/* Top plate caps the frame. */}
      <IsoBox
        anim="hv-iso-drop"
        d={64}
        delayMs={950}
        fx={146}
        fy={166}
        h={8}
        w={124}
      />

      {/* The powered server's boot glow. */}
      <g data-hv-enter style={enterStyle(1150, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
          cx="233.1"
          cy="228"
          r="8"
          strokeWidth="2"
        />
      </g>

      {/* Uplink leaves the base's right corner along the floor axis. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M253.4 272L305.4 242"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(1050, "hv-draw", 400)}
      />
      <g data-hv-enter style={enterStyle(1300, "hv-fade")}>
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M253.4 272L305.4 242"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx="309.4"
          cy="239.7"
          r="4"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Open source: an axis-aligned git graph merges into the repository. -- */

/* The main line runs along the +w floor axis from (36, 168) to (226, 58.4),
   sliding under the repository box anchored at (216, 64.2). The contribution
   branch offsets one depth step toward the viewer, runs parallel, and turns
   back to merge at (186, 81.4). Every segment lies on an iso axis. */

const OS_MAIN_COMMITS = [
  [66, 150.7],
  [126, 116.1],
] as const;
const OS_BRANCH_COMMITS = [
  [150.2, 130.1],
  [180.2, 112.8],
] as const;

export function OpenSourceVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-os-dots" />
      </defs>
      <rect fill="url(#iso-os-dots)" height="200" opacity="0.5" width="320" />

      {/* Main line, laid along the iso axis into the repository. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M36 168L226 58.4"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(140, "hv-draw", 500)}
      />
      {/* A contribution forks toward the viewer, runs beside the main line,
          and merges back — all on the two floor axes. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M86 139.1L110.2 153.1"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(420, "hv-draw", 250)}
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M110.2 153.1L210.2 95.4"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(520, "hv-draw", 350)}
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M210.2 95.4L186 81.4"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(700, "hv-draw", 250)}
      />

      {/* Commits land along the lines. */}
      {[[86, 139.1], ...OS_MAIN_COMMITS, ...OS_BRANCH_COMMITS].map(
        ([cx, cy], index) => (
          <circle
            className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
            cx={cx}
            cy={cy}
            data-hv-enter
            key={`${cx}-${cy}`}
            r="3.5"
            strokeWidth="2"
            style={enterStyle(680 + index * 70, "hv-pop", 350)}
          />
        ),
      )}

      {/* The merge lights up... */}
      <g data-hv-enter style={enterStyle(1040, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-primary opacity-40 motion-safe:animate-pulse"
          cx="186"
          cy="81.4"
          r="9"
          strokeWidth="2"
        />
        <circle className="fill-tinyrack-primary" cx="186" cy="81.4" r="4.5" />
      </g>

      {/* ...and history flows into the repository. */}
      <IsoShadow d={32} delayMs={600} fx={216} fy={70.2} w={44} />
      <IsoBox d={32} delayMs={700} fx={216} fy={64.2} h={18} w={44}>
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="245.4"
          cy="38.2"
          r="3"
        />
      </IsoBox>

      <g data-hv-enter style={enterStyle(1250, "hv-fade")}>
        <path
          className="hv-flow-slow stroke-tinyrack-border-strong opacity-60"
          d="M36 168L86 139.1"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
        <path
          className="hv-flow-slow stroke-tinyrack-border-strong opacity-60"
          d="M110.2 153.1L210.2 95.4"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M186 81.4L226 58.4"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Self-hosting: a lit home with its own server; the cloud link is cut. */

/* Walls: front corner (120, 158), w 76, d 52, h 34. The gable ridge runs
   along the width axis from (97.5, 85) to (163.3, 47). Door and window sit
   on the right wall plane. */

const HOUSE = {
  door: `${pt(132.1, 151)} ${pt(146, 143)} ${pt(146, 121)} ${pt(132.1, 129)}`,
  gable: `${pt(120, 124)} ${pt(75, 98)} ${pt(97.5, 85)}`,
  rightSlope: `${pt(120, 124)} ${pt(97.5, 85)} ${pt(163.3, 47)} ${pt(185.8, 86)}`,
  window: `${pt(158.1, 124)} ${pt(172, 116)} ${pt(172, 102)} ${pt(158.1, 110)}`,
};

export function SelfHostVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-host-dots" />
      </defs>
      <rect fill="url(#iso-host-dots)" height="200" opacity="0.5" width="320" />

      <FloorRings cx={150} cy={160} delayMs={0} rings={[44, 62, 80]} />
      <IsoShadow d={60} delayMs={150} fx={114} fy={166} w={90} />

      {/* The house: walls rise, the roof settles, the window lights up. */}
      <IsoBox d={52} delayMs={220} fx={120} fy={158} h={34} w={76} />
      <g data-hv-enter style={enterStyle(420, "hv-iso-drop")}>
        <polygon
          className="fill-tinyrack-surface-selected stroke-tinyrack-border"
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
      <g data-hv-enter style={enterStyle(560, "hv-fade")}>
        <polygon
          className="fill-tinyrack-surface-selected stroke-tinyrack-border"
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

      {/* A device on the floor, wired to the house along the floor axis. */}
      <IsoShadow d={18} delayMs={600} expand={4} fx={48} fy={174} w={24} />
      <IsoBox
        anim="hv-iso-drop"
        d={18}
        delayMs={660}
        fx={48}
        fy={170}
        h={12}
        w={24}
      />
      <path
        className="stroke-tinyrack-border-strong opacity-60"
        d="M68.8 158L94.4 143.2"
        data-hv-enter
        strokeDasharray="4 6"
        strokeWidth="2"
        style={enterStyle(900, "hv-fade")}
      />

      {/* The home server racked beside the house. */}
      <IsoShadow d={24} delayMs={700} expand={4} fx={236} fy={154} w={36} />
      <IsoBox
        anim="hv-iso-slot"
        d={24}
        delayMs={760}
        fx={236}
        fy={150}
        h={11}
        w={36}
      />
      <IsoBox
        anim="hv-iso-slot"
        d={24}
        delayMs={860}
        fx={236}
        fy={139}
        h={11}
        inverse
        w={36}
      >
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="260.2"
          cy="120"
          r="2.5"
        />
      </IsoBox>

      {/* Local link: the house feeds from its own hardware. */}
      <path
        className="stroke-tinyrack-border-strong opacity-60"
        d="M215.2 138L184.9 120.5"
        data-hv-enter
        strokeDasharray="4 6"
        strokeWidth="2"
        style={enterStyle(980, "hv-fade")}
      />
      <g data-hv-enter style={enterStyle(1250, "hv-fade")}>
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M215.2 138L184.9 120.5"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
        <path
          className="hv-flow-slow stroke-tinyrack-success"
          d="M68.8 158L94.4 143.2"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>

      {/* The cloud stays out of the picture: its link is cut mid-air. */}
      <path
        className="stroke-tinyrack-border opacity-50"
        d="M250 46h44a10 10 0 0 0 2.2-19.7A15 15 0 0 0 267 18a15 15 0 0 0-14.6 11.3A10 10 0 0 0 250 46Z"
        data-hv-enter
        strokeLinejoin="round"
        strokeWidth="2"
        style={enterStyle(1050, "hv-fade")}
      />
      <g data-hv-enter style={enterStyle(1200, "hv-fade")}>
        <path
          className="stroke-tinyrack-border opacity-60"
          d="M191 83L216 68.6"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-border opacity-60"
          d="M232 59.4L247 50.7"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
      </g>
      <g data-hv-enter style={enterStyle(1350, "hv-pop", 350)}>
        <path
          className="stroke-tinyrack-border-strong"
          d="M219 59l10 10M229 59l-10 10"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Simplicity: a crooked pile resolves into one calm unit. ------------- */

/* The pile sits low-left; one floor line runs along the +w axis from
   (64, 162.5) up to the calm unit's front corner at (196, 86.3). */

const PILE_SLABS = [
  { d: 36, fx: 58, fy: 166, w: 56 },
  { d: 30, fx: 74, fy: 155, w: 44 },
  { d: 32, fx: 56, fy: 144, w: 50 },
  { d: 26, fx: 72, fy: 133, w: 36 },
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

      {/* One clean line out of the mess, along the floor axis. It renders
          beneath the pile so it emerges from under the clutter. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M64 162.5L196 86.3"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(640, "hv-draw", 400)}
      />

      {/* The pile: mismatched slabs stacked askew, wiring loose. */}
      <IsoShadow d={48} delayMs={100} fx={52} fy={172} w={72} />
      {PILE_SLABS.map((slab, index) => (
        <IsoBox
          anim="hv-pop"
          d={slab.d}
          delayMs={160 + index * 80}
          fx={slab.fx}
          fy={slab.fy}
          h={10}
          key={slab.fy}
          w={slab.w}
        />
      ))}
      <g data-hv-enter style={enterStyle(520, "hv-fade")}>
        <path
          className="stroke-tinyrack-border opacity-60"
          d="M44 152C40 124 92 140 86 110S120 100 108 126"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-border opacity-60"
          d="M90 162C100 172 82 178 76 168"
          strokeDasharray="4 6"
          strokeWidth="2"
        />
      </g>

      {/* The calm unit. */}
      <FloorRings cx={210} cy={56} delayMs={640} rings={[24, 38]} />
      <IsoShadow d={48} delayMs={700} fx={196} fy={92.3} w={80} />
      <IsoBox d={48} delayMs={820} fx={196} fy={86.3} h={16} w={80}>
        <path
          className="stroke-tinyrack-border-strong"
          d={rightFaceLine(196, 86.3, 10, 44, 6)}
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-border-strong"
          d={rightFaceLine(196, 86.3, 10, 44, 12)}
          strokeWidth="2"
        />
      </IsoBox>
      <g data-hv-enter style={enterStyle(1050, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
          cx="253.2"
          cy="45.3"
          r="8"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-success motion-safe:animate-pulse"
          cx="253.2"
          cy="45.3"
          r="4"
        />
      </g>
      <g data-hv-enter style={enterStyle(1200, "hv-fade")}>
        <path
          className="hv-flow-slow stroke-tinyrack-border-strong opacity-60"
          d="M64 162.5L196 86.3"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- CTA band: products on iso pads along one ground-level trace. -------- */

/* Each product sits on a flat pad; the trace runs at y 74, the exact height
   of every pad's front floor corner, so the wire meets each object at ground
   level instead of cutting through its body. */

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
      {/* The shared trace with vias and terminals, at pad-corner height. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M40 74H920"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(80, "hv-draw", 600)}
      />
      <g data-hv-enter style={enterStyle(300, "hv-fade")}>
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx="40"
          cy="74"
          r="4"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx="920"
          cy="74"
          r="4"
          strokeWidth="2"
        />
        {CIRCUIT_VIAS.map((cx) => (
          <circle
            className="fill-tinyrack-border"
            cx={cx}
            cy="74"
            key={cx}
            r="2.5"
          />
        ))}
      </g>

      {/* Products sit on pads whose front corners touch the trace. */}
      {CIRCUIT_BOXES.map((box, index) => {
        const live = index === CIRCUIT_LIVE;
        const ledX = box.fx + RX * box.w * 0.72;
        const ledY = 64 - 0.36 * box.w - box.h * 0.5;

        return (
          <g key={box.fx}>
            <IsoBox
              anim="hv-fade"
              d={box.d + 16}
              delayMs={300 + index * 120}
              fx={box.fx - 7}
              fy={74}
              h={6}
              w={box.w + 16}
            />
            <IsoBox
              anim="hv-iso-drop"
              d={box.d}
              delayMs={420 + index * 120}
              fx={box.fx}
              fy={64}
              h={box.h}
              inverse={live}
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
          </g>
        );
      })}

      {/* Value flows across the whole band. */}
      <g data-hv-enter style={enterStyle(1050, "hv-fade")}>
        <path
          className="hv-flow stroke-tinyrack-success"
          d="M40 74H920"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
