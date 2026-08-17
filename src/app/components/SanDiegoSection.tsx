import { motion } from "motion/react";

const nodes = [
  {
    label: "Local Businesses",
    cx: 215,
    cy: 115,
    icon: (
      <>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
      </>
    ),
  },
  {
    label: "Neighbors",
    cx: 685,
    cy: 115,
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    label: "Discovery",
    cx: 90,
    cy: 260,
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </>
    ),
  },
  {
    label: "Payments",
    cx: 810,
    cy: 260,
    icon: (
      <>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </>
    ),
  },
  {
    label: "AI Automation",
    cx: 215,
    cy: 405,
    icon: (
      <>
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <rect width="6" height="6" x="9" y="9" rx="1" />
        <path d="M15 2v2" />
        <path d="M15 20v2" />
        <path d="M2 15h2" />
        <path d="M2 9h2" />
        <path d="M20 15h2" />
        <path d="M20 9h2" />
        <path d="M9 2v2" />
        <path d="M9 20v2" />
      </>
    ),
  },
  {
    label: "Community & Events",
    cx: 685,
    cy: 405,
    icon: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 2v4" />
        <path d="M16 2v4" />
      </>
    ),
  },
];

export function SanDiegoSection() {
  const hub = { cx: 450, cy: 260 };

  return (
    <section className="py-24 bg-[#000000] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[3]">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="mythos-headline-large text-white mb-6">
            Built for Your City
          </h2>
          <p className="mythos-body-large text-[#B0B0B0] max-w-3xl mx-auto">
            MythOS connects local businesses, people, and systems into shared digital infrastructure.
          </p>
        </motion.div>

        {/* Diagram */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg
            viewBox="0 0 900 520"
            width="100%"
            style={{ height: "auto", display: "block" }}
            role="img"
            aria-label="Diagram showing MythOS connecting local businesses, neighbors, discovery, payments, AI automation, and community into one shared system"
          >
            <defs>
              <linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0a3bff" />
                <stop offset="100%" stopColor="#fe9501" />
              </linearGradient>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0a3bff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#0a3bff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="hubFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0a3bff" />
                <stop offset="100%" stopColor="#0026a8" />
              </linearGradient>
            </defs>

            {/* Connecting lines */}
            {nodes.map((n) => (
              <line
                key={`line-${n.label}`}
                x1={hub.cx}
                y1={hub.cy}
                x2={n.cx}
                y2={n.cy}
                stroke="url(#flow)"
                strokeWidth="2.5"
                strokeDasharray="5 9"
                strokeLinecap="round"
                opacity="0.85"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-28"
                  dur="1.1s"
                  repeatCount="indefinite"
                />
              </line>
            ))}

            {/* Outer nodes */}
            {nodes.map((n) => (
              <g key={`node-${n.label}`}>
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="46"
                  fill="#0a0a0a"
                  stroke="#2a2a2a"
                  strokeWidth="1.5"
                />
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="46"
                  fill="none"
                  stroke="url(#flow)"
                  strokeWidth="2"
                  opacity="0.5"
                />
                <g
                  transform={`translate(${n.cx - 14}, ${n.cy - 16}) scale(1.15)`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {n.icon}
                </g>
                <text
                  x={n.cx}
                  y={n.cy + 72}
                  textAnchor="middle"
                  fill="#e5e5e5"
                  fontSize="20"
                  fontWeight="600"
                  fontFamily="inherit"
                >
                  {n.label}
                </text>
              </g>
            ))}

            {/* Center hub */}
            <circle cx={hub.cx} cy={hub.cy} r="130" fill="url(#hubGlow)" />
            <circle
              cx={hub.cx}
              cy={hub.cy}
              r="74"
              fill="url(#hubFill)"
              stroke="#fe9501"
              strokeWidth="2"
            />
            <text
              x={hub.cx}
              y={hub.cy - 2}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="30"
              fontWeight="800"
              fontFamily="inherit"
              letterSpacing="0.5"
            >
              MythOS
            </text>
            <text
              x={hub.cx}
              y={hub.cy + 24}
              textAnchor="middle"
              fill="#cdd8ff"
              fontSize="15"
              fontWeight="500"
              fontFamily="inherit"
            >
              the local OS
            </text>
          </svg>
        </motion.div>

        {/* Slogan + description */}
        <motion.div
          className="max-w-3xl mx-auto text-center mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-2xl sm:text-3xl font-semibold text-white leading-snug mb-6">
            Rebuilding the digital infrastructure for local economies.
          </p>
          <p className="mythos-body-large text-[#B0B0B0]">
            MythOS gives local businesses the tools, AI automations, and new forms of
            discovery they need to thrive. We connect neighbors to the shops around them,
            keep money circulating close to home, and turn everyday commerce into a
            stronger, more connected city. One shared system, built to help local win.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
