import { Home } from "lucide-react";
import { Link } from "react-router";

function MountainScene() {
  return (
    <svg
      viewBox="0 0 420 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto"
    >
      <defs>
        <linearGradient id="skyLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#faf5ff" />
        </linearGradient>
        <linearGradient id="skyDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e0840" />
          <stop offset="100%" stopColor="#0d0520" />
        </linearGradient>
        <linearGradient id="mtnFrontLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
        <linearGradient id="mtnFrontDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>
        <linearGradient id="mtnBackLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id="mtnBackDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sky */}
      <rect width="420" height="200" fill="url(#skyLight)" rx="16" className="dark:hidden" />
      <rect width="420" height="200" fill="url(#skyDark)" rx="16" className="hidden dark:block" />

      {/* Stars — dark only */}
      {[[30,18],[80,12],[140,22],[200,8],[260,18],[320,10],[380,20],[55,35],[170,30],[295,28]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%3===0?1.5:1} fill="#e9d5ff" opacity="0.8" className="hidden dark:block" />
      ))}

      {/* Sun / Moon */}
      <circle cx="340" cy="38" r="22" fill="#fde68a" opacity="0.9" filter="url(#glow)" className="dark:hidden" />
      <circle cx="340" cy="38" r="22" fill="#ede9fe" opacity="0.85" filter="url(#glow)" className="hidden dark:block" />
      <circle cx="334" cy="32" r="7" fill="#1e0840" opacity="0.6" className="hidden dark:block" />

      {/* Back mountains */}
      <path d="M0 160 L60 80 L120 130 L180 60 L240 110 L300 70 L360 120 L420 85 L420 200 L0 200Z"
        fill="url(#mtnBackLight)" opacity="0.7" className="dark:hidden" />
      <path d="M0 160 L60 80 L120 130 L180 60 L240 110 L300 70 L360 120 L420 85 L420 200 L0 200Z"
        fill="url(#mtnBackDark)" opacity="0.7" className="hidden dark:block" />

      {/* Front mountains */}
      <path d="M0 190 L80 100 L130 145 L200 75 L260 130 L310 90 L380 145 L420 110 L420 200 L0 200Z"
        fill="url(#mtnFrontLight)" className="dark:hidden" />
      <path d="M0 190 L80 100 L130 145 L200 75 L260 130 L310 90 L380 145 L420 110 L420 200 L0 200Z"
        fill="url(#mtnFrontDark)" className="hidden dark:block" />

      {/* Snow caps */}
      <path d="M200 75 L215 100 L185 100Z" fill="white" opacity="0.85" />
      <path d="M310 90 L322 110 L298 110Z" fill="white" opacity="0.7" />
      <path d="M80 100 L92 120 L68 120Z" fill="white" opacity="0.65" />

      {/* Animated dashed trail */}
      <path d="M100 190 Q160 165 200 155 Q250 145 300 170 Q340 185 380 175"
        stroke="#c084fc" strokeWidth="2.5" strokeDasharray="8 5" fill="none" opacity="0.8"
        style={{ animation: "dashMove 2s linear infinite" }} />

      {/* Floating lost pin */}
      <g style={{ animation: "floatPin 3s ease-in-out infinite" }}>
        <circle cx="210" cy="148" r="10" fill="#9333ea" opacity="0.95" filter="url(#glow)" />
        <circle cx="210" cy="148" r="4" fill="white" />
        <text x="210" y="134" textAnchor="middle" fontSize="11" fill="#1a0a3c"
          fontWeight="800" fontFamily="sans-serif">?</text>
      </g>

      {/* Compass */}
      <g transform="translate(352,152)">
        <circle cx="0" cy="0" r="14" fill="white" fillOpacity="0.85" stroke="#9333ea" strokeWidth="1.5" className="dark:hidden" />
        <circle cx="0" cy="0" r="14" fill="#1e0840" fillOpacity="0.85" stroke="#a855f7" strokeWidth="1.5" className="hidden dark:block" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#9333ea" strokeWidth="1.5"
          style={{ animation: "compassSpin 4s ease-in-out infinite", transformOrigin: "center" }}
          className="dark:hidden" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#c084fc" strokeWidth="1.5"
          style={{ animation: "compassSpin 4s ease-in-out infinite", transformOrigin: "center" }}
          className="hidden dark:block" />
        <circle cx="0" cy="0" r="2" fill="#9333ea" />
        <text x="0" y="-10" textAnchor="middle" fontSize="5" fontWeight="800" fontFamily="sans-serif"
          fill="#9333ea" className="dark:hidden">N</text>
        <text x="0" y="-10" textAnchor="middle" fontSize="5" fontWeight="800" fontFamily="sans-serif"
          fill="#c084fc" className="hidden dark:block">N</text>
      </g>

      <style>{`
        @keyframes dashMove  { to { stroke-dashoffset: -26; } }
        @keyframes floatPin  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes compassSpin { 0%,100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
      `}</style>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center gap-6 px-4
      bg-purple-50 dark:bg-[#0d0520] transition-colors duration-300">

      {/* Ambient glow */}
      <div className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl pointer-events-none
        bg-purple-400/30 dark:bg-purple-600/25" />

      {/* Mountain scene */}
      <div className="z-10 w-full max-w-sm">
        <MountainScene />
      </div>

      {/* 404 */}
      <h1
        className="z-10 font-black text-5xl sm:text-7xl lg:text-9xl text-purple-900 leading-none select-none"
      >
        404
      </h1>

      {/* Message */}
      <div className="z-10 text-center -mt-2">
        <p className="text-lg font-semibold text-purple-700 dark:text-purple-100">
          Page not found
        </p>
        <p className="text-sm mt-1 text-purple-500 dark:text-purple-400">
          Looks like this trail doesn't exist.
        </p>
      </div>

      <Link
        to="/"
        className="z-10 border border-purple-500 bg-purple-500 flex items-center gap-2 px-6 py-3 rounded-md text-white font-semibold text-sm
          transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
        >
        <Home size={16} />
        Back to Home
      </Link>
    </div>
  );
}