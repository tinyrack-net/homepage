import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/use-in-view.ts";

/**
 * Decorative, token-only SVG illustrations for the landing page, drawn as
 * isometric 2.5D scenes. Every line sits on the two iso floor axes
 * (slope ±0.577) or is vertical. Every solid isometric object uses
 * the primary illustration fill on its front, the secondary fill on top, and
 * the tertiary fill on its side. This top-lit hierarchy casts a dedicated
 * illustration shadow and keeps a 2px illustration stroke, so both themes
 * retain a natural depth cue.
 *
 * Each scene tells its section's story: servers slide into a four-post rack
 * frame and boot (hero), unit blocks converge into one shared build with a
 * slot still open for the next contributor (open source), a server tower
 * sliding into a lived-in room — window, door, potted plant — and settling
 * in running (self-hosting), one small server above a rack plinth that conceals
 * its full supporting rack (simplicity), and products on iso pads
 * joined by one ground-level trace (the CTA band).
 *
 * Each illustration is its own scroll stage: the root `<svg>` carries
 * `hv-stage` and a sticky `data-inview` flag from `useInView`, and every
 * `[data-hv-enter]` group plays its entrance (rise, drop, slot, pop, draw —
 * see app/styles/visuals.css) after its inline `--hv-delay`. Resting styles
 * are the finished artwork, so prerendered HTML and reduced-motion users see
 * the complete composition. Entrances play once per page mount; ambient loops
 * stay behind `motion-safe`.
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
  durationMs,
  fx,
  fy,
  h,
  w,
}: {
  anim?: string;
  children?: ReactNode;
  d: number;
  delayMs: number;
  durationMs?: number;
  fx: number;
  fy: number;
  h: number;
  w: number;
}) {
  const faces = isoFaces(fx, fy, w, d, h);

  return (
    <g data-hv-enter data-iso-box style={enterStyle(delayMs, anim, durationMs)}>
      <polygon
        className="fill-tinyrack-illustration-fill-tertiary stroke-tinyrack-illustration-stroke"
        data-iso-face="side"
        points={faces.left}
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <polygon
        className="fill-tinyrack-illustration-fill-primary stroke-tinyrack-illustration-stroke"
        data-iso-face="front"
        points={faces.right}
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <polygon
        className="fill-tinyrack-illustration-fill-secondary stroke-tinyrack-illustration-stroke"
        data-iso-face="top"
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
  durationMs,
  expand = 6,
  fx,
  fy,
  w,
}: {
  d: number;
  delayMs: number;
  durationMs?: number;
  expand?: number;
  fx: number;
  fy: number;
  w: number;
}) {
  return (
    <polygon
      className="fill-tinyrack-illustration-shadow"
      data-hv-enter
      points={baseDiamond(fx, fy + expand, w + 2 * expand, d + 2 * expand)}
      style={enterStyle(delayMs, "hv-fade", durationMs)}
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
          className="stroke-tinyrack-illustration-stroke"
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
      <circle
        className="fill-tinyrack-illustration-detail"
        cx="2"
        cy="2"
        r="1.5"
      />
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
/** Feet under each base-frame corner (front, right, left, rear). */
const RACK_FEET = [
  { fx: 150, fy: 336 },
  { fx: 245.3, fy: 281 },
  { fx: 101.5, fy: 308 },
  { fx: 196.8, fy: 253 },
] as const;

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

      <FloorRings cx={172} cy={306} delayMs={0} rings={[40, 58, 76]} />
      <IsoShadow d={58} delayMs={100} fx={150} fy={340} w={112} />

      {/* Leveling feet at the four corners, so the rack meets the floor like
          real hardware instead of sitting on a slab. */}
      {RACK_FEET.map((foot, index) => (
        <IsoBox
          d={12}
          delayMs={120 + index * 40}
          fx={foot.fx}
          fy={foot.fy}
          h={7}
          key={`${foot.fx},${foot.fy}`}
          w={12}
        />
      ))}

      {/* Rack base frame: the four posts rise from its corners. */}
      <IsoBox d={56} delayMs={220} fx={150} fy={330} h={9} w={110} />

      {/* Rear mounting posts rise before the servers arrive. */}
      <path
        className="stroke-tinyrack-illustration-stroke"
        d="M196.8 239V83"
        data-hv-enter
        pathLength={100}
        strokeWidth="3"
        style={enterStyle(280, "hv-draw", 350)}
      />
      <path
        className="stroke-tinyrack-illustration-stroke"
        d="M101.5 294V138"
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
        const detail = "stroke-tinyrack-illustration-stroke";

        return (
          <IsoBox
            anim="hv-iso-slot"
            d={56}
            delayMs={500 + slab * 110}
            fx={150}
            fy={fy}
            h={26}
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
                powered
                  ? "fill-tinyrack-success"
                  : "fill-tinyrack-illustration-detail"
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
            className="stroke-tinyrack-illustration-stroke"
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
        className="stroke-tinyrack-illustration-stroke"
        d="M245.3 267V111"
        data-hv-enter
        pathLength={100}
        strokeWidth="3"
        style={enterStyle(400, "hv-draw", 350)}
      />
      <path
        className="stroke-tinyrack-illustration-stroke"
        d="M150 322V166"
        data-hv-enter
        pathLength={100}
        strokeWidth="3"
        style={enterStyle(460, "hv-draw", 350)}
      />

      {/* Top plate caps the frame flush with the four posts. */}
      <IsoBox
        anim="hv-iso-drop"
        d={56}
        delayMs={950}
        fx={150}
        fy={166}
        h={7}
        w={110}
      />

      {/* The powered server's boot glow. */}
      <g data-hv-enter style={enterStyle(1150, "hv-pop", 400)}>
        <circle
          className="hv-signal-ring stroke-tinyrack-success opacity-tinyrack-disabled"
          cx="233.1"
          cy="228"
          r="8"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Hero foreground: a full-width isometric server hall. A row of tall
   cabinets stands shoulder to shoulder like a data-center aisle seen head-on,
   each front ruled into rack units with live LEDs and a soft shadow grounding
   it. Grand enough to carry a hero. */

const DC_BASE = 320;
const DC_W = 66;
const DC_D = 84;
const DC_STEP = 136;
const DC_FX0 = 150;
/** Per-cabinet skyline height and whether it runs a live LED. */
const DC_CABINETS = [
  { h: 182, live: true },
  { h: 166, live: false },
  { h: 190, live: true },
  { h: 176, live: false },
  { h: 186, live: true },
  { h: 162, live: true },
  { h: 180, live: false },
  { h: 172, live: true },
] as const;

/** Heights of the horizontal unit rules climbing a cabinet's front face. */
function cabinetUnits(h: number): number[] {
  const rules: number[] = [];
  for (let t = 12; t < h - 10; t += 15) {
    rules.push(t);
  }
  return rules;
}

export function DataCenterVisual({ className }: VisualProps) {
  // Framed tight to the row so the cabinets read large and the end ones bleed
  // off the screen edges.
  const stage = useVisualStage(className, "104 48 992 300");

  return (
    <svg aria-hidden="true" {...stage}>
      {/* Keep every footprint below the complete cabinet row. Pairing a
          footprint with each cabinet would let later footprints paint over
          cabinets rendered earlier in the row. */}
      <g data-dc-shadow-layer>
        {DC_CABINETS.map((_, index) => {
          const fx = DC_FX0 + index * DC_STEP;
          const delayMs = 200 + index * 90;

          return (
            <IsoShadow
              d={DC_D}
              delayMs={delayMs}
              durationMs={620}
              fx={fx}
              fy={DC_BASE + 4}
              key={fx}
              w={DC_W}
            />
          );
        })}
      </g>
      <g data-dc-cabinet-layer>
        {DC_CABINETS.map((cab, index) => {
          const fx = DC_FX0 + index * DC_STEP;
          const fy = DC_BASE;
          const delayMs = 200 + index * 90;
          const detail = "stroke-tinyrack-illustration-stroke";
          // The LED sits at the right end of the topmost unit rule, so every
          // cabinet's light lands on the same landmark instead of drifting.
          const rules = cabinetUnits(cab.h);
          const topRule = rules[rules.length - 1] ?? 12;
          const ledU = DC_W - 8;
          const ledX = fx + RX * ledU;
          const ledY = fy - 0.5 * ledU - topRule;

          return (
            <IsoBox
              anim="hv-iso-rise"
              d={DC_D}
              delayMs={delayMs}
              durationMs={620}
              fx={fx}
              fy={fy}
              h={cab.h}
              key={fx}
              w={DC_W}
            >
              {rules.map((t) => (
                <path
                  className={detail}
                  d={rightFaceLine(fx, fy, 8, DC_W - 8, t)}
                  key={t}
                  opacity="0.5"
                  strokeWidth="1.5"
                />
              ))}
              {cab.live ? (
                <circle
                  className="hv-signal-ring stroke-tinyrack-success opacity-tinyrack-disabled"
                  cx={ledX}
                  cy={ledY}
                  r="7"
                  strokeWidth="2"
                />
              ) : null}
              <circle
                className={
                  cab.live
                    ? "fill-tinyrack-success"
                    : "fill-tinyrack-illustration-detail"
                }
                cx={ledX}
                cy={ledY}
                r={cab.live ? 3 : 2}
              />
            </IsoBox>
          );
        })}
      </g>
    </svg>
  );
}

/* --- Open source: unit blocks converge into one shared build. Plain cubes
   already stand two levels high, one cell is still a dashed outline waiting
   for whoever comes next, and the newest contribution hovers over its open
   slot. Anyone can add a block; the build belongs to everyone. */

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
            className="stroke-tinyrack-illustration-stroke"
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
        className="stroke-tinyrack-illustration-stroke"
        d={`M${pt(slot.x, slot.y - 2)}V${block.y + 2}`}
        data-hv-enter
        strokeDasharray="2 4"
        strokeWidth="2"
        style={enterStyle(1250, "hv-fade")}
      />

      {/* The newest contribution arrives over its slot. */}
      <IsoBox
        anim="hv-iso-drop"
        d={OS_CELL}
        delayMs={1400}
        fx={block.x}
        fy={block.y}
        h={OS_CELL}
        w={OS_CELL}
      />
    </svg>
  );
}

/* --- Self-hosting: a server moves into your home. A room corner with a
   window, a door and a potted plant says "your place", and a small server
   tower — plinth and two vented units — slides in as one piece, settles on the
   floor, and lights up running. */

const SH_ROOM = {
  floor: "150,182 260.9,118 181.2,72 70.3,136",
  wallLeft: "70.3,136 181.2,72 181.2,16 70.3,80",
  wallRight: "260.9,118 181.2,72 181.2,16 260.9,62",
};
const SH_WINDOW = {
  frame: "79,107 108.4,90 108.4,68 79,85",
  mullionH: "M79 96L108.4 79",
  mullionV: "M93.7 98.5V76.5",
};
const SH_DOOR = {
  frame: "196.8,81 219.3,94 219.3,50 196.8,37",
  knob: { x: 215.8, y: 70 },
};
const SH_PLANT = {
  leaves: [
    "M102 138C100 127 96 122 92 118",
    "M102 138C104 125 108 120 112 117",
    "M102 138C102 127 101 120 100 114",
  ],
  pot: { d: 13, fx: 102, fy: 150, h: 9, w: 13 },
};
const SH_TOWER = { d: 40, fx: 162, fy: 149, w: 48 } as const;
const SH_BASE_H = 6;
const SH_UNIT = { d: 34, h: 15, w: 40 } as const;
const SH_UNITS = [0, 1] as const;
const SH_LIVE_UNIT = 1;
const SH_VENTS = [5, 10] as const;
/** The whole tower arrives as one piece: same slide on every part. */
const SH_ARRIVE = { delayMs: 600, durationMs: 650 } as const;

export function SelfHostVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");
  const { d, fx, fy, w } = SH_TOWER;
  // Units sit centered on the plinth: equal insets along both floor axes.
  const seat = isoOffset(
    fx,
    fy - SH_BASE_H,
    (w - SH_UNIT.w) / 2,
    (d - SH_UNIT.d) / 2,
  );
  const unitY = (k: number) => seat.y - k * SH_UNIT.h;
  const ledU = SH_UNIT.w - 10;
  const ledX = seat.x + RX * ledU;
  const ledY = (uY: number) => uY - 0.5 * ledU - SH_UNIT.h / 2;

  return (
    <svg aria-hidden="true" {...stage}>
      <defs>
        <DotPattern id="iso-host-dots" />
      </defs>
      <rect fill="url(#iso-host-dots)" height="200" opacity="0.5" width="320" />

      {/* Your place: a room corner with a window. */}
      <g data-hv-enter style={enterStyle(0, "hv-fade")}>
        <polygon
          className="fill-tinyrack-illustration-fill-tertiary stroke-tinyrack-illustration-stroke"
          points={SH_ROOM.wallLeft}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <polygon
          className="fill-tinyrack-illustration-fill-primary stroke-tinyrack-illustration-stroke"
          points={SH_ROOM.wallRight}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <polygon
          className="fill-tinyrack-illustration-fill-secondary stroke-tinyrack-illustration-stroke"
          points={SH_ROOM.floor}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g data-hv-enter style={enterStyle(160, "hv-fade")}>
        <polygon
          className="fill-tinyrack-illustration-fill-primary stroke-tinyrack-illustration-stroke"
          points={SH_WINDOW.frame}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-illustration-stroke"
          d={SH_WINDOW.mullionH}
          strokeWidth="2"
        />
        <path
          className="stroke-tinyrack-illustration-stroke"
          d={SH_WINDOW.mullionV}
          strokeWidth="2"
        />
      </g>

      {/* The front door on the right wall. */}
      <g data-hv-enter style={enterStyle(260, "hv-fade")}>
        <polygon
          className="fill-tinyrack-illustration-fill-secondary stroke-tinyrack-illustration-stroke"
          points={SH_DOOR.frame}
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-illustration-detail"
          cx={SH_DOOR.knob.x}
          cy={SH_DOOR.knob.y}
          r="2"
        />
      </g>

      {/* A potted plant by the window — somebody lives here. The leaves
          render after the pot so they spill out over its front rim. */}
      <IsoBox
        anim="hv-pop"
        d={SH_PLANT.pot.d}
        delayMs={400}
        fx={SH_PLANT.pot.fx}
        fy={SH_PLANT.pot.fy}
        h={SH_PLANT.pot.h}
        w={SH_PLANT.pot.w}
      />
      <g data-hv-enter style={enterStyle(400, "hv-pop")}>
        {SH_PLANT.leaves.map((leaf) => (
          <path
            className="stroke-tinyrack-illustration-stroke"
            d={leaf}
            key={leaf}
            strokeLinecap="round"
            strokeWidth="2"
          />
        ))}
      </g>

      {/* The server tower moves in and settles on the floor: its plinth and two
          vented units all slide as one piece. */}
      <IsoBox
        anim="hv-iso-slot"
        d={d}
        delayMs={SH_ARRIVE.delayMs}
        durationMs={SH_ARRIVE.durationMs}
        fx={fx}
        fy={fy}
        h={SH_BASE_H}
        w={w}
      />
      {SH_UNITS.map((k) => {
        const uY = unitY(k);
        const live = k === SH_LIVE_UNIT;

        return (
          <IsoBox
            anim="hv-iso-slot"
            d={SH_UNIT.d}
            delayMs={SH_ARRIVE.delayMs}
            durationMs={SH_ARRIVE.durationMs}
            fx={seat.x}
            fy={uY}
            h={SH_UNIT.h}
            key={k}
            w={SH_UNIT.w}
          >
            {SH_VENTS.map((t) => (
              <path
                className="stroke-tinyrack-illustration-stroke"
                d={rightFaceLine(seat.x, uY, 8, SH_UNIT.w - 14, t)}
                key={t}
                strokeWidth="2"
              />
            ))}
            <circle
              className={
                live
                  ? "fill-tinyrack-success"
                  : "fill-tinyrack-illustration-detail"
              }
              cx={ledX}
              cy={ledY(uY)}
              r={live ? 3.5 : 2.5}
            />
          </IsoBox>
        );
      })}
      {/* Settled in and running. */}
      <g data-hv-enter style={enterStyle(1350, "hv-pop", 400)}>
        <circle
          className="hv-signal-ring stroke-tinyrack-success opacity-tinyrack-disabled"
          cx={ledX}
          cy={ledY(unitY(SH_LIVE_UNIT))}
          r="7"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

/* --- Simplicity: one clear server above the rack plinth, while the full rack
   and structural volume that support it stay tucked underneath. The
   solid plinth paints after the infrastructure so it visibly conceals the
   upper part of that complexity instead of presenting an exploded stack. */

const SIMPLE_BASE = { d: 68, fx: 160, fy: 125, h: 9, w: 88 } as const;
const SIMPLE_UNIT = { d: 38, h: 18, w: 52 } as const;
const SIMPLE_VENTS = [6, 12] as const;
const SIMPLE_HIDDEN_HEIGHT = 50;
const SIMPLE_STACK = { d: 48, h: 12, w: 64 } as const;
const SIMPLE_STACK_UNITS = [0, 1, 2, 3] as const;
const SIMPLE_STACK_VENTS = [4, 8] as const;

export function SimplicityVisual({ className }: VisualProps) {
  const stage = useVisualStage(className, "0 0 320 200");
  const hiddenFrame = isoFaces(
    SIMPLE_BASE.fx,
    SIMPLE_BASE.fy + SIMPLE_HIDDEN_HEIGHT,
    SIMPLE_BASE.w,
    SIMPLE_BASE.d,
    SIMPLE_HIDDEN_HEIGHT,
  );
  const unitSeat = isoOffset(
    SIMPLE_BASE.fx,
    SIMPLE_BASE.fy - SIMPLE_BASE.h,
    (SIMPLE_BASE.w - SIMPLE_UNIT.w) / 2,
    (SIMPLE_BASE.d - SIMPLE_UNIT.d) / 2,
  );
  const stackTop = isoOffset(
    SIMPLE_BASE.fx,
    SIMPLE_BASE.fy,
    (SIMPLE_BASE.w - SIMPLE_STACK.w) / 2,
    (SIMPLE_BASE.d - SIMPLE_STACK.d) / 2,
  );
  const stackBottomY = stackTop.y + SIMPLE_STACK.h * SIMPLE_STACK_UNITS.length;
  const ledU = SIMPLE_UNIT.w - 10;
  const ledX = unitSeat.x + RX * ledU;
  const ledY = unitSeat.y - 0.5 * ledU - SIMPLE_UNIT.h / 2;

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

      <IsoShadow
        d={SIMPLE_BASE.d}
        delayMs={0}
        expand={4}
        fx={SIMPLE_BASE.fx}
        fy={SIMPLE_BASE.fy + SIMPLE_HIDDEN_HEIGHT}
        w={SIMPLE_BASE.w}
      />

      {/* A full rack stack assembles inside the recessed support
          volume. The solid rack plinth below is painted later and hides the
          upper portion, making this read as contained infrastructure. */}
      <g data-simplicity-complexity>
        <g data-hv-enter style={enterStyle(80, "hv-fade")}>
          {[hiddenFrame.left, hiddenFrame.right, hiddenFrame.top].map(
            (points) => (
              <polygon
                className="stroke-tinyrack-illustration-stroke"
                key={points}
                points={points}
                strokeDasharray="4 6"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            ),
          )}
        </g>
        {SIMPLE_STACK_UNITS.map((k) => {
          const stackY = stackBottomY - k * SIMPLE_STACK.h;
          const detailU = SIMPLE_STACK.w - 9;

          return (
            <IsoBox
              anim="hv-iso-rise"
              d={SIMPLE_STACK.d}
              delayMs={180 + k * 90}
              fx={stackTop.x}
              fy={stackY}
              h={SIMPLE_STACK.h}
              key={k}
              w={SIMPLE_STACK.w}
            >
              {SIMPLE_STACK_VENTS.map((t) => (
                <path
                  className="stroke-tinyrack-illustration-stroke"
                  d={rightFaceLine(
                    stackTop.x,
                    stackY,
                    8,
                    SIMPLE_STACK.w - 16,
                    t,
                  )}
                  key={t}
                  strokeWidth="2"
                />
              ))}
              <circle
                className="fill-tinyrack-illustration-detail"
                cx={stackTop.x + RX * detailU}
                cy={stackY - 0.5 * detailU - SIMPLE_STACK.h / 2}
                r="2"
              />
            </IsoBox>
          );
        })}
      </g>

      {/* The broad, opaque plinth is the visual boundary: complexity stays
          beneath it while the product-facing surface remains quiet. */}
      <g data-simplicity-cover>
        <IsoBox
          anim="hv-iso-drop"
          d={SIMPLE_BASE.d}
          delayMs={620}
          fx={SIMPLE_BASE.fx}
          fy={SIMPLE_BASE.fy}
          h={SIMPLE_BASE.h}
          w={SIMPLE_BASE.w}
        />
      </g>

      {/* The one small unit you actually touch, running above the plinth. */}
      <IsoBox
        anim="hv-iso-drop"
        d={SIMPLE_UNIT.d}
        delayMs={820}
        fx={unitSeat.x}
        fy={unitSeat.y}
        h={SIMPLE_UNIT.h}
        w={SIMPLE_UNIT.w}
      >
        {SIMPLE_VENTS.map((t) => (
          <path
            className="stroke-tinyrack-illustration-stroke"
            d={rightFaceLine(unitSeat.x, unitSeat.y, 8, SIMPLE_UNIT.w - 14, t)}
            key={t}
            strokeWidth="2"
          />
        ))}
        <circle className="fill-tinyrack-success" cx={ledX} cy={ledY} r="3.5" />
      </IsoBox>
      <g data-hv-enter style={enterStyle(1300, "hv-pop", 400)}>
        <circle
          className="hv-signal-ring stroke-tinyrack-success opacity-tinyrack-disabled"
          cx={ledX}
          cy={ledY}
          r="7"
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
        className="stroke-tinyrack-illustration-stroke"
        d="M40 74H920"
        data-hv-enter
        pathLength={100}
        strokeWidth="2"
        style={enterStyle(80, "hv-draw", 600)}
      />
      <g data-hv-enter style={enterStyle(300, "hv-fade")}>
        <circle
          className="fill-tinyrack-illustration-fill-primary stroke-tinyrack-illustration-stroke"
          cx="40"
          cy="74"
          r="4"
          strokeWidth="2"
        />
        <circle
          className="fill-tinyrack-illustration-fill-primary stroke-tinyrack-illustration-stroke"
          cx="920"
          cy="74"
          r="4"
          strokeWidth="2"
        />
        {CIRCUIT_VIAS.map((cx) => (
          <circle
            className="fill-tinyrack-illustration-detail"
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
              w={box.w}
            >
              {live ? (
                <g>
                  <circle
                    className="hv-signal-ring stroke-tinyrack-success opacity-tinyrack-disabled"
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
                  className="fill-tinyrack-illustration-detail"
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
