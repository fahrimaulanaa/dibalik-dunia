import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface LogoBadgeProps {
  logoUrl?: string;
  size?: number;
  delay?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  shortName?: string;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  logoUrl,
  size = 140,
  delay = 5,
  primaryColor = '#3B82F6',
  secondaryColor = '#06B6D4',
  accentColor = '#F59E0B',
  shortName = 'HMT',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popProgress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {
      damping: 10,
      stiffness: 90,
      mass: 0.9,
    },
  });

  const scale = interpolate(popProgress, [0, 1], [0.2, 1]);
  const opacity = interpolate(popProgress, [0, 1], [0, 1]);
  const rotation = interpolate(popProgress, [0, 1], [-25, 0]);

  // Subtle continuous ambient pulse
  const pulse = Math.sin((frame / fps) * 3) * 0.03;
  const outerRotate = (frame * 0.4) % 360;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale + pulse}) rotate(${rotation}deg)`,
      }}
    >
      {/* Outer ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: size * 1.5,
          height: size * 1.5,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}44 0%, transparent 70%)`,
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative dashed orbiting ring */}
      <svg
        style={{
          position: 'absolute',
          width: size * 1.25,
          height: size * 1.25,
          transform: `rotate(${outerRotate}deg)`,
        }}
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="1.5"
          strokeDasharray="6 8"
          strokeOpacity="0.6"
        />
      </svg>

      {/* Logo container / emblem */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          background: `linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)`,
          border: `2px solid ${secondaryColor}66`,
          boxShadow: `0 12px 32px rgba(0,0,0,0.6), 0 0 24px ${primaryColor}44, inset 0 1px 1px rgba(255,255,255,0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo Himpunan"
            style={{
              width: size * 0.75,
              height: size * 0.75,
              objectFit: 'contain',
            }}
          />
        ) : (
          /* High-res technical/engineering geometric crest */
          <svg
            width={size * 0.72}
            height={size * 0.72}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="50%" stopColor={secondaryColor} />
                <stop offset="100%" stopColor={accentColor} />
              </linearGradient>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Hexagon Shield */}
            <polygon
              points="60,10 105,32 105,88 60,110 15,88 15,32"
              fill="url(#shieldGrad)"
              stroke="url(#crestGrad)"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Inner dynamic gear / atom lines */}
            <circle
              cx="60"
              cy="60"
              r="26"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M40 60 L80 60 M60 40 L60 80"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />

            {/* Monogram / text */}
            <text
              x="60"
              y="68"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="22"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="1px"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))' }}
            >
              {shortName}
            </text>
          </svg>
        )}

        {/* Gloss highlight reflex */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)',
            borderTopLeftRadius: size * 0.28,
            borderTopRightRadius: size * 0.28,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};
