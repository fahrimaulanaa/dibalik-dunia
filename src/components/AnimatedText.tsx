import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT_FAMILY } from '../styles/fonts';

interface AnimatedTextProps {
  text: string;
  delay?: number;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  gradient?: string;
  letterSpacing?: number;
  lineHeight?: number;
  maxWidth?: number | string;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  textTransform?: 'uppercase' | 'none' | 'capitalize';
  springDamping?: number;
  springStiffness?: number;
  autoScale?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  fontSize = 64,
  fontWeight = 800,
  color = '#FFFFFF',
  gradient,
  letterSpacing = 0,
  lineHeight = 1.15,
  maxWidth = '100%',
  textAlign = 'center',
  fontFamily = FONT_FAMILY.heading,
  textTransform = 'uppercase',
  springDamping = 12,
  springStiffness = 110,
  autoScale = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Auto-scale calculation: if text is unusually long, scale down gracefully
  // This satisfies Success Metric 2 from PRD (no broken overflow on long titles)
  let calculatedFontSize = fontSize;
  if (autoScale) {
    const textLength = text.length;
    if (textLength > 45) {
      calculatedFontSize = fontSize * 0.62;
    } else if (textLength > 30) {
      calculatedFontSize = fontSize * 0.75;
    } else if (textLength > 20) {
      calculatedFontSize = fontSize * 0.88;
    }
  }

  // Split text by words for staggered bounce effect
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:
          textAlign === 'center'
            ? 'center'
            : textAlign === 'right'
            ? 'flex-end'
            : 'flex-start',
        alignItems: 'center',
        columnGap: calculatedFontSize * 0.28,
        rowGap: calculatedFontSize * 0.15,
        maxWidth,
        width: '100%',
        margin: '0 auto',
      }}
    >
      {words.map((word, index) => {
        const wordDelay = delay + index * 4;
        const progress = spring({
          frame: Math.max(0, frame - wordDelay),
          fps,
          config: {
            damping: springDamping,
            stiffness: springStiffness,
            mass: 0.8,
          },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [40, 0]);
        const scale = interpolate(progress, [0, 1], [0.85, 1]);

        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: 'inline-block',
              fontFamily,
              fontSize: calculatedFontSize,
              fontWeight,
              lineHeight,
              letterSpacing: `${letterSpacing}px`,
              textTransform,
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              transformOrigin: 'center bottom',
              color: gradient ? 'transparent' : color,
              backgroundImage: gradient || undefined,
              WebkitBackgroundClip: gradient ? 'text' : undefined,
              backgroundClip: gradient ? 'text' : undefined,
              textShadow: gradient
                ? 'none'
                : '0 4px 20px rgba(0,0,0,0.5)',
              wordBreak: 'break-word',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
