import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface BackgroundParticlesProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  primaryColor = '#3B82F6',
  secondaryColor = '#06B6D4',
  accentColor = '#F59E0B',
  backgroundColor = '#0A0F1D',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Floating ambient motion
  const t = frame / fps;
  const spot1X = 25 + Math.sin(t * 0.8) * 8;
  const spot1Y = 30 + Math.cos(t * 0.6) * 10;
  const spot2X = 75 + Math.cos(t * 0.7) * 9;
  const spot2Y = 65 + Math.sin(t * 0.9) * 8;

  // Grid sweep
  const gridOffsetY = (frame * 0.6) % 60;

  // Particle points
  const particles = [
    { x: 15, y: 25, size: 4, speed: 0.9, color: secondaryColor },
    { x: 35, y: 70, size: 6, speed: 1.2, color: primaryColor },
    { x: 75, y: 20, size: 5, speed: 0.8, color: accentColor },
    { x: 85, y: 65, size: 7, speed: 1.1, color: secondaryColor },
    { x: 50, y: 85, size: 4, speed: 1.4, color: primaryColor },
    { x: 20, y: 55, size: 3, speed: 0.7, color: accentColor },
    { x: 65, y: 40, size: 5, speed: 1.0, color: secondaryColor },
    { x: 90, y: 35, size: 4, speed: 1.3, color: primaryColor },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Dynamic radial gradient spotlights */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at ${spot1X}% ${spot1Y}%, ${primaryColor}30 0%, transparent 55%),
            radial-gradient(circle at ${spot2X}% ${spot2Y}%, ${secondaryColor}25 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, ${accentColor}15 0%, transparent 60%)
          `,
          opacity: 0.85,
        }}
      />

      {/* Cybernetic geometric grid overlay */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          left: 0,
          width: '100%',
          height: height + 120,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translateY(${gridOffsetY}px)`,
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 75%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 75%, transparent 100%)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => {
        const floatY = (p.y + Math.sin(t * p.speed + i) * 6) % 100;
        const floatX = (p.x + Math.cos(t * p.speed * 0.7 + i) * 3) % 100;
        const opacity = interpolate(
          Math.sin(t * 2 + i),
          [-1, 1],
          [0.2, 0.75]
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${floatX}%`,
              top: `${floatY}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              opacity,
            }}
          />
        );
      })}

      {/* Modern cinematic vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(5, 8, 15, 0.75) 100%)',
        }}
      />
    </div>
  );
};
