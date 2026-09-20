import React from "react";
import { motion } from "motion/react";

export type PandaMood =
  | "waving"
  | "breathing"
  | "cheering"
  | "listening"
  | "sleeping"
  | "laughing"
  | "thinking";

interface PandaMascotProps {
  mood?: PandaMood;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

export const PandaMascot: React.FC<PandaMascotProps> = ({
  mood = "waving",
  size = "md",
  className = "",
  animate = true,
}) => {
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-36 h-36",
    xl: "w-48 h-48",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
    >
      <motion.svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-sm"
        animate={
          animate
            ? mood === "breathing"
              ? { scale: [1, 1.07, 1] }
              : mood === "laughing"
              ? { rotate: [-2, 2, -2, 2, 0], y: [0, -3, 0, -3, 0] }
              : mood === "waving"
              ? { y: [0, -3, 0] }
              : { y: [0, -2, 0] }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: mood === "breathing" ? 4 : mood === "laughing" ? 1.4 : 3,
          ease: "easeInOut",
        }}
      >
        <defs>
          <radialGradient id="pandaBellyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F5F2F9" />
          </radialGradient>
          <linearGradient id="pandaEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E2836" />
            <stop offset="100%" stopColor="#433B4F" />
          </linearGradient>
          <linearGradient id="pandaCheekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFCCD5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB3C1" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Outer subtle glow in lavender */}
        <circle cx="80" cy="80" r="72" fill="#F0EBFC" opacity="0.6" />

        {/* Ears */}
        <motion.circle
          cx="42"
          cy="42"
          r="19"
          fill="url(#pandaEarGrad)"
          animate={mood === "laughing" ? { rotate: [-5, 5, -5] } : {}}
          style={{ originX: "42px", originY: "42px" }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
        <circle cx="43" cy="43" r="10" fill="#6C5B7B" opacity="0.4" />

        <motion.circle
          cx="118"
          cy="42"
          r="19"
          fill="url(#pandaEarGrad)"
          animate={mood === "laughing" ? { rotate: [5, -5, 5] } : {}}
          style={{ originX: "118px", originY: "42px" }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
        <circle cx="117" cy="43" r="10" fill="#6C5B7B" opacity="0.4" />

        {/* Head */}
        <ellipse cx="80" cy="84" rx="52" ry="46" fill="url(#pandaBellyGrad)" stroke="#E8E1F2" strokeWidth="2.5" />

        {/* Rosy Cheeks */}
        <circle cx="48" cy="94" r="8" fill="url(#pandaCheekGrad)" />
        <circle cx="112" cy="94" r="8" fill="url(#pandaCheekGrad)" />

        {/* Eye Patches (Dark Lavender-Charcoal) */}
        <ellipse cx="54" cy="74" rx="14" ry="17" transform="rotate(-15 54 74)" fill="url(#pandaEarGrad)" />
        <ellipse cx="106" cy="74" rx="14" ry="17" transform="rotate(15 106 74)" fill="url(#pandaEarGrad)" />

        {/* Eyes based on mood */}
        {mood === "sleeping" || mood === "breathing" ? (
          // Serene closed smile eyes
          <>
            <path
              d="M 46 74 Q 54 82 62 74"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 98 74 Q 106 82 114 74"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </>
        ) : mood === "laughing" ? (
          // Squinting joyful laughter arches (><)
          <>
            <path
              d="M 46 76 Q 54 68 62 76"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M 98 76 Q 106 68 114 76"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Laughter tear sparkle */}
            <circle cx="40" cy="78" r="2.5" fill="#8CE8FF" />
            <circle cx="120" cy="78" r="2.5" fill="#8CE8FF" />
          </>
        ) : mood === "thinking" ? (
          // Curious eyes looking slightly up
          <>
            <circle cx="56" cy="71" r="5" fill="#FFFFFF" />
            <circle cx="58" cy="69" r="2.2" fill="#2E2836" />
            <circle cx="104" cy="71" r="5" fill="#FFFFFF" />
            <circle cx="106" cy="69" r="2.2" fill="#2E2836" />
          </>
        ) : (
          // Sparkly attentive friendly eyes
          <>
            <circle cx="54" cy="74" r="5.5" fill="#FFFFFF" />
            <circle cx="55" cy="73" r="3.2" fill="#201C24" />
            <circle cx="53" cy="71" r="1.5" fill="#FFFFFF" />
            <circle cx="106" cy="74" r="5.5" fill="#FFFFFF" />
            <circle cx="105" cy="73" r="3.2" fill="#201C24" />
            <circle cx="104" cy="71" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="80" cy="85" rx="5" ry="3.8" fill="#3D3447" />

        {/* Mouth */}
        {mood === "laughing" || mood === "cheering" ? (
          // Open cheerful smile with pink tongue
          <g>
            <path
              d="M 72 90 Q 80 102 88 90 Z"
              fill="#E56B82"
              stroke="#3D3447"
              strokeWidth="1.8"
            />
            <path
              d="M 75 94 Q 80 98 85 94"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              opacity="0.6"
            />
          </g>
        ) : (
          // Gentle warm curved smile
          <path
            d="M 74 89 Q 80 94 86 89"
            fill="none"
            stroke="#3D3447"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Paws */}
        {mood === "waving" ? (
          // Waving right paw
          <motion.g
            animate={{ rotate: [-8, 20, -8] }}
            style={{ originX: "125px", originY: "115px" }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          >
            <ellipse cx="125" cy="108" rx="11" ry="14" fill="url(#pandaEarGrad)" />
            <circle cx="124" cy="107" r="5" fill="#FFCCD5" opacity="0.7" />
          </motion.g>
        ) : mood === "thinking" ? (
          // Paw gently resting near chin
          <ellipse cx="98" cy="102" rx="10" ry="12" fill="url(#pandaEarGrad)" />
        ) : mood === "cheering" ? (
          // Both paws up in joy
          <>
            <ellipse cx="32" cy="70" rx="10" ry="13" transform="rotate(-30 32 70)" fill="url(#pandaEarGrad)" />
            <ellipse cx="128" cy="70" rx="10" ry="13" transform="rotate(30 128 70)" fill="url(#pandaEarGrad)" />
          </>
        ) : (
          // Resting cozy paws
          <>
            <ellipse cx="50" cy="120" rx="10" ry="8" fill="url(#pandaEarGrad)" />
            <ellipse cx="110" cy="120" rx="10" ry="8" fill="url(#pandaEarGrad)" />
          </>
        )}

        {/* Ambient flower/leaf or sparkle accessory */}
        {mood === "cheering" && (
          <>
            <text x="24" y="36" fontSize="14">✨</text>
            <text x="122" y="36" fontSize="14">✨</text>
          </>
        )}
        {mood === "sleeping" && (
          <text x="114" y="32" fontSize="14" fill="#9F86C0" opacity="0.8">zZz</text>
        )}
      </motion.svg>
    </div>
  );
};
