/**
 * Decorative, token-only SVG illustrations for the landing page. Every color
 * comes from a design-system class (`stroke-tinyrack-*` / `fill-tinyrack-*`),
 * so the artwork follows the light and dark themes for free. Status LEDs and
 * flowing dashes animate via `motion-safe:animate-pulse` and the
 * `home-visual-flow` keyframe, and stay static under reduced motion.
 *
 * The set is themed around the brand values: the rack (hero), open source,
 * self-hosting, and simplicity, plus the circuit strip in the CTA band.
 */

type VisualProps = {
  className?: string;
};

/** A server rack with one powered unit — the self-hosting brand image. */
export function RackVisual({ className }: VisualProps) {
  const units = [0, 1, 2, 3, 4];
  const poweredUnit = 2;

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 320 360"
    >
      <defs>
        <pattern
          height="18"
          id="rack-dots"
          patternUnits="userSpaceOnUse"
          width="18"
        >
          <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect fill="url(#rack-dots)" height="360" opacity="0.5" width="320" />

      {/* Cabinet. */}
      <rect
        className="fill-tinyrack-canvas stroke-tinyrack-border"
        height="344"
        rx="12"
        strokeWidth="2"
        width="240"
        x="40"
        y="8"
      />
      {/* Mounting rails with screw holes. */}
      <line
        className="stroke-tinyrack-border"
        strokeWidth="2"
        x1="64"
        x2="64"
        y1="20"
        y2="340"
      />
      <line
        className="stroke-tinyrack-border"
        strokeWidth="2"
        x1="256"
        x2="256"
        y1="20"
        y2="340"
      />
      {units.map((unit) => (
        <g key={`screws-${unit}`}>
          <circle
            className="fill-tinyrack-border"
            cx="56"
            cy={44 + unit * 56}
            r="2.5"
          />
          <circle
            className="fill-tinyrack-border"
            cx="264"
            cy={44 + unit * 56}
            r="2.5"
          />
        </g>
      ))}

      {units.map((unit) => {
        const y = 32 + unit * 56;
        const powered = unit === poweredUnit;

        return (
          <g key={`unit-${unit}`}>
            <rect
              className={
                powered
                  ? "fill-tinyrack-surface-inverse"
                  : "fill-tinyrack-surface stroke-tinyrack-border"
              }
              height="44"
              rx="6"
              strokeWidth="2"
              width="168"
              x="76"
              y={y}
            />
            {/* Handle. */}
            <rect
              className={
                powered
                  ? "fill-tinyrack-border-inverse"
                  : "fill-tinyrack-border"
              }
              height="20"
              rx="2"
              width="4"
              x="86"
              y={y + 12}
            />
            {/* Vents. */}
            {[0, 1, 2].map((vent) => (
              <line
                className={
                  powered
                    ? "stroke-tinyrack-border-inverse"
                    : "stroke-tinyrack-border"
                }
                key={vent}
                strokeWidth="2"
                x1="102"
                x2="196"
                y1={y + 12 + vent * 10}
                y2={y + 12 + vent * 10}
              />
            ))}
            {/* Status LED. */}
            {powered ? (
              <g>
                <circle
                  className="stroke-tinyrack-success opacity-40"
                  cx="228"
                  cy={y + 22}
                  r="8"
                  strokeWidth="2"
                />
                <circle
                  className="fill-tinyrack-success motion-safe:animate-pulse"
                  cx="228"
                  cy={y + 22}
                  r="4"
                />
              </g>
            ) : (
              <circle
                className="fill-tinyrack-border"
                cx="228"
                cy={y + 22}
                r="3"
              />
            )}
          </g>
        );
      })}

      {/* Cable from the powered unit down to the cabinet floor, with data
          flowing along it. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M244 176c18 0 22 14 22 36v112"
        strokeWidth="2"
      />
      <path
        className="home-visual-flow stroke-tinyrack-success"
        d="M244 176c18 0 22 14 22 36v112"
        strokeDasharray="4 16"
        strokeWidth="2"
      />
      <circle className="fill-tinyrack-border-strong" cx="266" cy="330" r="4" />
    </svg>
  );
}

/**
 * A public repository with contributors feeding a branch that merges back —
 * the open-source value.
 */
export function OpenSourceVisual({ className }: VisualProps) {
  const contributors = [168, 208];

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 320 200"
    >
      <defs>
        <pattern
          height="18"
          id="os-dots"
          patternUnits="userSpaceOnUse"
          width="18"
        >
          <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect fill="url(#os-dots)" height="200" opacity="0.5" width="320" />

      {/* The repository, wide open. */}
      <rect
        className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
        height="64"
        rx="8"
        strokeWidth="2"
        width="76"
        x="14"
        y="90"
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="m40 110-10 12 10 12"
        strokeWidth="2"
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="m64 110 10 12-10 12"
        strokeWidth="2"
      />

      {/* Main line out of the repo, with work flowing along it. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M90 122h222"
        strokeWidth="2"
      />
      <path
        className="home-visual-flow stroke-tinyrack-success"
        d="M90 122h222"
        strokeDasharray="4 16"
        strokeWidth="2"
      />
      {/* Contribution branch. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M120 122c18 0 18-52 36-52h64c18 0 18 52 36 52"
        strokeWidth="2"
      />

      {/* Commits. */}
      {[120, 192].map((cx) => (
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx={cx}
          cy="122"
          key={cx}
          r="8"
          strokeWidth="2"
        />
      ))}
      {contributors.map((cx) => (
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx={cx}
          cy="70"
          key={cx}
          r="8"
          strokeWidth="2"
        />
      ))}
      {/* The merge, highlighted. */}
      <circle
        className="stroke-tinyrack-primary opacity-40"
        cx="256"
        cy="122"
        r="13"
        strokeWidth="2"
      />
      <circle className="fill-tinyrack-primary" cx="256" cy="122" r="8" />

      {/* Contributors handing work to the branch. */}
      {contributors.map((cx) => (
        <g key={`contributor-${cx}`}>
          <line
            className="stroke-tinyrack-border"
            strokeDasharray="4 6"
            strokeWidth="2"
            x1={cx}
            x2={cx}
            y1="40"
            y2="62"
          />
          <circle
            className="fill-tinyrack-canvas stroke-tinyrack-border"
            cx={cx}
            cy="28"
            r="11"
            strokeWidth="2"
          />
          <circle
            className="fill-tinyrack-border-strong"
            cx={cx}
            cy="25"
            r="3.5"
          />
          <path
            className="stroke-tinyrack-border-strong"
            d={`M${cx - 5} 34c1-3 9-3 10 0`}
            strokeWidth="2"
          />
        </g>
      ))}

      {/* Release tag after the merge. */}
      <rect
        className="fill-tinyrack-canvas stroke-tinyrack-border"
        height="18"
        rx="5"
        strokeWidth="2"
        width="44"
        x="234"
        y="150"
      />
      <line
        className="stroke-tinyrack-border-strong"
        strokeWidth="2"
        x1="242"
        x2="270"
        y1="159"
        y2="159"
      />
    </svg>
  );
}

/** A rack unit serving the devices inside your own four walls. */
export function SelfHostVisual({ className }: VisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 320 200"
    >
      <defs>
        <pattern
          height="18"
          id="host-dots"
          patternUnits="userSpaceOnUse"
          width="18"
        >
          <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect fill="url(#host-dots)" height="200" opacity="0.5" width="320" />

      {/* The house. */}
      <path
        className="fill-tinyrack-canvas stroke-tinyrack-border"
        d="M64 84v104h192V84"
        strokeWidth="2"
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M48 92 160 16l112 76"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      {/* Chimney. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M228 62V38h16v35"
        strokeWidth="2"
      />

      {/* The home server. */}
      <rect
        className="fill-tinyrack-surface-inverse"
        height="26"
        rx="5"
        width="80"
        x="120"
        y="102"
      />
      <line
        className="stroke-tinyrack-border-inverse"
        strokeWidth="2"
        x1="132"
        x2="172"
        y1="111"
        y2="111"
      />
      <line
        className="stroke-tinyrack-border-inverse"
        strokeWidth="2"
        x1="132"
        x2="172"
        y1="119"
        y2="119"
      />
      <circle
        className="fill-tinyrack-success motion-safe:animate-pulse"
        cx="188"
        cy="115"
        r="3.5"
      />
      <rect
        className="fill-tinyrack-canvas stroke-tinyrack-border"
        height="26"
        rx="5"
        strokeWidth="2"
        width="80"
        x="120"
        y="136"
      />
      {[0, 1].map((vent) => (
        <line
          className="stroke-tinyrack-border"
          key={vent}
          strokeWidth="2"
          x1="132"
          x2="172"
          y1={145 + vent * 8}
          y2={145 + vent * 8}
        />
      ))}
      <circle className="fill-tinyrack-border" cx="188" cy="149" r="3" />

      {/* Devices served inside the walls. */}
      <rect
        className="fill-tinyrack-canvas stroke-tinyrack-border"
        height="18"
        rx="3"
        strokeWidth="2"
        width="32"
        x="76"
        y="150"
      />
      <line
        className="stroke-tinyrack-border"
        strokeWidth="2"
        x1="70"
        x2="114"
        y1="172"
        y2="172"
      />
      <rect
        className="fill-tinyrack-canvas stroke-tinyrack-border"
        height="28"
        rx="4"
        strokeWidth="2"
        width="16"
        x="228"
        y="144"
      />
      <circle className="fill-tinyrack-border" cx="236" cy="167" r="1.5" />

      {/* Local links, flowing. */}
      <path
        className="home-visual-flow stroke-tinyrack-border"
        d="M120 149c-14 0-20 6-28 8"
        strokeDasharray="4 6"
        strokeWidth="2"
      />
      <path
        className="home-visual-flow stroke-tinyrack-border"
        d="M200 149c12 0 18 6 26 8"
        strokeDasharray="4 6"
        strokeWidth="2"
      />
    </svg>
  );
}

/** Complexity untangled into one straight line — the simplicity value. */
export function SimplicityVisual({ className }: VisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 320 200"
    >
      <defs>
        <pattern
          height="18"
          id="simple-dots"
          patternUnits="userSpaceOnUse"
          width="18"
        >
          <circle className="fill-tinyrack-border" cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <rect fill="url(#simple-dots)" height="200" opacity="0.5" width="320" />

      {/* The tangle. */}
      <path
        className="stroke-tinyrack-border"
        d="M10 100c14-52 26 56 42 4s22-64 34-12-12 68 14 12 22-48 40-4"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        className="stroke-tinyrack-border opacity-60"
        d="M10 124c18-40 30 28 46-8s20-52 36-8-8 52 20 8 20-32 34 0"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        className="stroke-tinyrack-border opacity-60"
        d="M14 72c16 36 30-24 46 12s24 40 38 4"
        strokeLinecap="round"
        strokeWidth="2"
      />

      {/* The point where it resolves. */}
      <circle
        className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
        cx="160"
        cy="100"
        r="11"
        strokeWidth="2"
      />
      <circle className="fill-tinyrack-border-strong" cx="160" cy="100" r="3" />

      {/* One clear line out. */}
      <path
        className="stroke-tinyrack-border-strong"
        d="M171 100h113"
        strokeWidth="2"
      />
      <path
        className="home-visual-flow stroke-tinyrack-success"
        d="M171 100h113"
        strokeDasharray="4 16"
        strokeWidth="2"
      />
      <rect
        className="fill-tinyrack-surface-inverse"
        height="28"
        rx="7"
        width="28"
        x="284"
        y="86"
      />
      <circle
        className="fill-tinyrack-success motion-safe:animate-pulse"
        cx="298"
        cy="100"
        r="3"
      />
    </svg>
  );
}

/**
 * A horizontal run of circuit traces — used as the connective motif inside the
 * "what we make" band, flowing from the copy toward the calls to action.
 */
export function CircuitVisual({ className }: VisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 960 96"
    >
      <path
        className="stroke-tinyrack-border"
        d="M0 16h320v32h592"
        strokeWidth="2"
      />
      <path
        className="stroke-tinyrack-border"
        d="M0 80h600V48"
        strokeWidth="2"
      />
      <path
        className="stroke-tinyrack-border-strong"
        d="M0 48h912"
        strokeWidth="2"
      />
      <path
        className="home-visual-flow stroke-tinyrack-success"
        d="M0 48h912"
        strokeDasharray="4 16"
        strokeWidth="2"
      />
      {[
        { x: 160, y: 48 },
        { x: 320, y: 16 },
        { x: 320, y: 48 },
        { x: 480, y: 48 },
        { x: 600, y: 80 },
        { x: 600, y: 48 },
        { x: 760, y: 48 },
      ].map((via) => (
        <circle
          className="fill-tinyrack-canvas stroke-tinyrack-border-strong"
          cx={via.x}
          cy={via.y}
          key={`${via.x}-${via.y}`}
          r="5"
          strokeWidth="2"
        />
      ))}
      <rect
        className="fill-tinyrack-surface-inverse"
        height="28"
        rx="7"
        width="28"
        x="916"
        y="34"
      />
      <circle
        className="fill-tinyrack-success motion-safe:animate-pulse"
        cx="930"
        cy="48"
        r="3"
      />
    </svg>
  );
}
