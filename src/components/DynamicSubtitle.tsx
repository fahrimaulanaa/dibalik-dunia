import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface DynamicSubtitleProps {
  text: string;
  startFrame?: number;
  durationInFrames?: number;
}

export const DynamicSubtitle: React.FC<DynamicSubtitleProps> = ({
  text,
  startFrame = 0,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  // Calculate timing per word: adapt dynamically so all words fit within duration
  const defaultFramesPerWord = fps / 2.5;
  const framesPerWord = durationInFrames
    ? Math.min(
        defaultFramesPerWord,
        Math.max(10, (durationInFrames - 30) / Math.max(1, words.length))
      )
    : defaultFramesPerWord;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '220px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px 16px',
          width: '88%',
          maxWidth: '960px',
          background: 'rgba(10, 15, 29, 0.78)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '24px 32px',
          borderRadius: 24,
          border: '1.5px solid rgba(253, 224, 71, 0.35)',
          boxShadow:
            '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(253, 224, 71, 0.18)',
        }}
      >
        {words.map((word, index) => {
          const wordStartFrame = startFrame + index * framesPerWord;
          const scale = interpolate(
            frame,
            [wordStartFrame, wordStartFrame + 5],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );
          const opacity = interpolate(
            frame,
            [wordStartFrame, wordStartFrame + 3],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );

          // Word pop active highlight (yellow glow on currently spoken word)
          const isActive =
            frame >= wordStartFrame && frame < wordStartFrame + framesPerWord;

          return (
            <span
              key={index}
              style={{
                color: isActive ? '#FDE047' : '#FFFFFF',
                fontSize: words.length > 25 ? '38px' : '44px',
                fontFamily: 'sans-serif',
                fontWeight: 900,
                textShadow: isActive
                  ? '0px 0px 24px rgba(253, 224, 71, 0.9), 0px 4px 12px rgba(0,0,0,0.9)'
                  : '0px 4px 10px rgba(0,0,0,0.8)',
                transform: `scale(${scale})`,
                opacity,
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
