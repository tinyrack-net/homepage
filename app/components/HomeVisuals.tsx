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
 * frame and boot (hero), unit blocks converge into one shared build with a
 * slot still open for the next contributor (open source), a lit home
 * wired to its own server while
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

/** Floor-plane point u along the width axis and v along the depth axis. */
function isoOffset(
  fx: number,
  fy: number,
  u: number,
  v: number,
): { x: number; y: number } {
  return { x: fx + RX * (u - v), y: fy - 0.5 * (u + v) };
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
  const stage = useVisualStage(className, "15 28 320 360");
  const ghost = isoFaces(150, 194, 110, 56, 26);

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-rack-dots" />
      </defs>
      <rect
        fill="url(#iso-rack-dots)"
        height="360"
        opacity="0.5"
        width="320"
        x="15"
        y="28"
      />

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

/* --- Open source: unit blocks converge into one shared build. Plain cubes
   already stand two levels high, one cell is still a dashed outline waiting
   for whoever comes next, and the newest contribution hovers over its open
   slot, marked live. Anyone can add a block; the build belongs to everyone. */

const OS_CELL = 40;
const OS_BUILD = { fx: 160, fy: 178 } as const;
const OS_HOVER = 26;

/** Filled cells of the 2×2×2 build as [i, j, k] grid indices, in paint and
    arrival order (back to front, bottom to top). */
const OS_FILLED = [
  [1, 1, 0],
  [0, 1, 0],
  [1, 0, 0],
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 1],
] as const;

/** Front-bottom corner of the build cell at grid indices (i, j, k). */
function osCell(i: number, j: number, k: number): { x: number; y: number } {
  const p = isoOffset(OS_BUILD.fx, OS_BUILD.fy, i * OS_CELL, j * OS_CELL);
  return { x: p.x, y: p.y - k * OS_CELL };
}

export function OpenSourceVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");

  // The two open cells on the top level: a dashed invitation on the right,
  // and the front slot the arriving block hovers over.
  const ghostCell = osCell(1, 0, 1);
  const ghost = isoFaces(ghostCell.x, ghostCell.y, OS_CELL, OS_CELL, OS_CELL);
  const slot = osCell(0, 0, 1);
  const block = { x: slot.x, y: slot.y - OS_HOVER };
  const ledU = OS_CELL - 12;
  const ledX = block.x + RX * ledU;
  const ledY = block.y - 0.5 * ledU - OS_CELL / 2;

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-os-dots" />
      </defs>
      <rect fill="url(#iso-os-dots)" height="200" opacity="0.5" width="320" />

      <IsoShadow
        d={2 * OS_CELL}
        delayMs={100}
        fx={OS_BUILD.fx}
        fy={OS_BUILD.fy + 6}
        w={2 * OS_CELL}
      />

      {/* The shared build: plain cubes converging from different directions —
          ground cubes rise, upper cubes slide in along the depth axis. */}
      {OS_FILLED.map(([i, j, k], index) => {
        const cell = osCell(i, j, k);

        return (
          <IsoBox
            anim={k === 0 ? "hv-iso-rise" : "hv-iso-slot"}
            d={OS_CELL}
            delayMs={160 + index * 140}
            fx={cell.x}
            fy={cell.y}
            h={OS_CELL}
            key={`${i}${j}${k}`}
            w={OS_CELL}
          />
        );
      })}

      {/* An open cell waits for whoever contributes next. */}
      <g data-hv-enter style={enterStyle(1100, "hv-fade")}>
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

      {/* The drop guide marks where the arriving block lands. */}
      <path
        className="stroke-tinyrack-border"
        d={`M${pt(slot.x, slot.y - 2)}V${block.y + 2}`}
        data-hv-enter
        strokeDasharray="2 4"
        strokeWidth="2"
        style={enterStyle(1250, "hv-fade")}
      />

      {/* The newest contribution arrives over its slot, powered up. */}
      <IsoBox
        anim="hv-iso-drop"
        d={OS_CELL}
        delayMs={1400}
        fx={block.x}
        fy={block.y}
        h={OS_CELL}
        inverse
        w={OS_CELL}
      >
        <circle className="fill-tinyrack-success" cx={ledX} cy={ledY} r="3.5" />
      </IsoBox>
      <g data-hv-enter style={enterStyle(1700, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
          cx={ledX}
          cy={ledY}
          r="8"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Self-hosting: the same solid tiny rack, but inside your own four walls.
   It stands in the corner of your room and actively serves your own devices
   over live local links — you are the host. No cloud, no cut: just your
   hardware, in your space, running your things. */

const SH_RACK = { d: 44, fx: 152, fy: 150, w: 88 } as const;
const SH_UNITS = [0, 1] as const;
const SH_UNIT_H = 24;
const SH_LIVE_UNIT = 1;
const SH_UNIT_VENTS = [9, 16] as const;
const SH_UNIT_FX = 156;
const SH_UNIT_W = 80;
const SH_UNIT_D = 38;
const SH_BASE_H = 7;
const SH_ROOM = {
  floor: "150,182 260.9,118 181.2,72 70.3,136",
  wallLeft: "70.3,136 181.2,72 181.2,16 70.3,80",
  wallRight: "260.9,118 181.2,72 181.2,16 260.9,62",
};
const SH_LINK = "M120 152Q136 149 150 149";

export function SelfHostVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");
  const { d, fx, fy, w } = SH_RACK;
  const unitY = (k: number) => fy - SH_BASE_H - k * SH_UNIT_H;
  const ledX = SH_UNIT_FX + RX * (SH_UNIT_W - 14);
  const ledY = (uY: number) => uY - 0.5 * (SH_UNIT_W - 14) - SH_UNIT_H / 2;

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-host-dots" />
      </defs>
      <rect fill="url(#iso-host-dots)" height="200" opacity="0.5" width="320" />

      {/* Your four walls: a room corner the rack lives inside. */}
      <g data-hv-enter style={enterStyle(0, "hv-fade")}>
        <polygon
          className="fill-tinyrack-surface-selected stroke-tinyrack-border opacity-70"
          points={SH_ROOM.wallLeft}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <polygon
          className="fill-tinyrack-surface stroke-tinyrack-border opacity-70"
          points={SH_ROOM.wallRight}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <polygon
          className="stroke-tinyrack-border"
          points={SH_ROOM.floor}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>

      <IsoShadow d={d} delayMs={220} fx={fx} fy={fy + 6} w={w} />

      {/* Base plinth. */}
      <IsoBox d={d} delayMs={280} fx={fx} fy={fy} h={SH_BASE_H} w={w} />

      {/* Two units stacked into a small home rack; the top one runs. */}
      {SH_UNITS.map((k) => {
        const uY = unitY(k);
        const live = k === SH_LIVE_UNIT;
        const detail = live
          ? "stroke-tinyrack-success"
          : "stroke-tinyrack-border-strong";

        return (
          <IsoBox
            anim="hv-iso-rise"
            d={SH_UNIT_D}
            delayMs={360 + k * 150}
            fx={SH_UNIT_FX}
            fy={uY}
            h={SH_UNIT_H}
            key={k}
            w={SH_UNIT_W}
          >
            {SH_UNIT_VENTS.map((t) => (
              <path
                className={detail}
                d={rightFaceLine(SH_UNIT_FX, uY, 10, SH_UNIT_W - 16, t)}
                key={t}
                strokeWidth="2"
              />
            ))}
            <circle
              className={
                live ? "fill-tinyrack-success" : "fill-tinyrack-border"
              }
              cx={ledX}
              cy={ledY(uY)}
              r={live ? 3 : 2.5}
            />
          </IsoBox>
        );
      })}

      {/* Thin cap seals the block. */}
      <IsoBox
        anim="hv-iso-drop"
        d={SH_UNIT_D}
        delayMs={720}
        fx={SH_UNIT_FX}
        fy={unitY(SH_UNITS.length - 1) - SH_UNIT_H}
        h={4}
        w={SH_UNIT_W}
      />

      {/* Your own device, sitting in the room, served by the rack. */}
      <IsoShadow d={20} delayMs={820} expand={4} fx={98} fy={170} w={30} />
      <IsoBox
        anim="hv-iso-rise"
        d={20}
        delayMs={880}
        fx={98}
        fy={166}
        h={10}
        w={30}
      >
        <path
          className="stroke-tinyrack-success"
          d={rightFaceLine(98, 166, 6, 24, 5)}
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-success"
          cx={115.6}
          cy={150.5}
          r={2.5}
        />
      </IsoBox>

      {/* Live local link: your rack serves your device. */}
      <path
        className="stroke-tinyrack-border-strong"
        d={SH_LINK}
        data-hv-enter
        fill="none"
        strokeWidth="2"
        style={enterStyle(980, "hv-fade")}
      />
      <g data-hv-enter style={enterStyle(1160, "hv-fade")}>
        <path
          className="hv-flow stroke-tinyrack-success"
          d={SH_LINK}
          fill="none"
          strokeDasharray="4 16"
          strokeWidth="2"
        />
      </g>

      {/* Running glow on the live unit. */}
      <g data-hv-enter style={enterStyle(1080, "hv-pop", 400)}>
        <circle
          className="stroke-tinyrack-success opacity-40 motion-safe:animate-pulse"
          cx={ledX}
          cy={ledY(unitY(SH_LIVE_UNIT))}
          r="8"
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
