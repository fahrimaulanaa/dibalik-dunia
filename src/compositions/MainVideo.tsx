import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import timelineData from '../content/timeline.json';
import { FONT_FAMILY } from '../styles/fonts';

export interface SceneItem {
  id: string;
  sceneNumber: number;
  startAtSecond: number;
  endAtSecond: number;
  durationSeconds: number;
  fromFrame: number;
  durationInFrames: number;
  visual: string;
  animation: string;
  text: string;
  notes?: string;
  audioFile: string;
}

export interface TimelineData {
  metadata: {
    sourceFile: string;
    fps: number;
    width: number;
    height: number;
    totalDurationInSeconds: number;
    totalDurationInFrames: number;
    sceneCount?: number;
  };
  scenes: SceneItem[];
}

interface MainVideoProps {
  timeline?: TimelineData;
}

// Scene Visual Renderer with Extended Animation Support
const SceneVisual: React.FC<{
  visual: string;
  animation: string;
  durationInFrames: number;
}> = ({ visual, animation, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = animation.toLowerCase();

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let filter = 'none';

  if (anim.includes('slow-scale-up') || anim === 'zoom-in') {
    scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
      extrapolateRight: 'clamp',
    });
  } else if (anim.includes('pan-up')) {
    translateY = interpolate(frame, [0, durationInFrames], [40, -40], {
      extrapolateRight: 'clamp',
    });
    scale = 1.08;
  } else if (anim.includes('pan-right')) {
    translateX = interpolate(frame, [0, durationInFrames], [-50, 50], {
      extrapolateRight: 'clamp',
    });
    scale = 1.08;
  } else if (anim.includes('glow-pulse')) {
    const pulse = Math.sin((frame / fps) * 6) * 0.04;
    scale = 1.05 + pulse;
    const brightness = 1 + Math.sin((frame / fps) * 8) * 0.15;
    filter = `brightness(${brightness})`;
  } else if (anim.includes('parallax-float')) {
    translateX = Math.sin((frame / fps) * 2) * 15;
    translateY = Math.cos((frame / fps) * 2.5) * 15;
    scale = 1.06;
  } else if (anim.includes('spring-bounce')) {
    const bounce = spring({
      frame: Math.max(0, frame - 5),
      fps,
      config: { damping: 10, stiffness: 100 },
    });
    scale = interpolate(bounce, [0, 1], [0.85, 1.03]);
  } else {
    scale = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  }

  // Cross-fade transitions
  const fadeIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Fallback support: if .png was specified in markdown, seamlessly match .svg
  let resolvedVisual = visual;
  if (resolvedVisual.endsWith('.png')) {
    resolvedVisual = resolvedVisual.replace(/\.png$/, '.svg');
  }

  const imageSrc = resolvedVisual.startsWith('http')
    ? resolvedVisual
    : staticFile(`visuals/${resolvedVisual}`);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#05070E',
        opacity,
      }}
    >
      <Img
        src={imageSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: 'center center',
          filter,
        }}
      />

      {/* Cinematic dark gradient vignette for enhanced subtitle contrast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(5,8,16,0.65) 0%, transparent 30%, rgba(5,8,16,0.2) 60%, rgba(5,8,16,0.94) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// Modern Dynamic Subtitle Component
const DynamicSubtitle: React.FC<{
  text: string;
  durationInFrames: number;
}> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance pop
  const popSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const translateY = interpolate(popSpring, [0, 1], [35, 0]);
  const opacity = interpolate(popSpring, [0, 1], [0, 1]);

  // Fade out before scene ends
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Auto-scale subtitle size for long texts (e.g. 250+ characters)
  const textLength = text.length;
  const fontSize = textLength > 180 ? 30 : textLength > 120 ? 34 : 40;
  const lineHeight = textLength > 180 ? 1.3 : 1.35;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 300, // Safe zone above TikTok / Reels bottom interactive UI
        left: 48,
        right: 48,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translateY(${translateY}px)`,
        opacity: Math.min(opacity, exitOpacity),
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(253, 224, 71, 0.45)', // glowing warm yellow accent
          boxShadow:
            '0 24px 56px rgba(0, 0, 0, 0.8), 0 0 28px rgba(253, 224, 71, 0.25)',
          borderRadius: 24,
          padding: '24px 36px',
          maxWidth: '960px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY.heading,
            fontSize,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight,
            letterSpacing: '0.4px',
            textShadow: '0 2px 14px rgba(0,0,0,0.8)',
            wordBreak: 'break-word',
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export const MainVideo: React.FC<MainVideoProps> = ({
  timeline = timelineData as TimelineData,
}) => {
  const frame = useCurrentFrame();
  const { totalDurationInFrames } = timeline.metadata;

  // Global top progress bar indicator
  const progressPercent = (frame / Math.max(1, totalDurationInFrames)) * 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0F1D',
        width: 1080,
        height: 1920,
        overflow: 'hidden',
      }}
    >
      {/* Top Global Progress Bar (TikTok/Reels style) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #3B82F6 0%, #EAB308 100%)',
            boxShadow: '0 0 14px #EAB308',
          }}
        />
      </div>

      {/* Render Dynamic Sequences from Markdown Timeline */}
      {timeline.scenes.map((scene) => {
        return (
          <Sequence
            key={scene.id}
            from={scene.fromFrame}
            durationInFrames={scene.durationInFrames}
          >
            {/* 1. Synchronized TTS Audio */}
            {scene.audioFile && (
              <Audio src={staticFile(scene.audioFile)} volume={1.0} />
            )}

            {/* 2. Animated Visual Element */}
            <SceneVisual
              visual={scene.visual}
              animation={scene.animation}
              durationInFrames={scene.durationInFrames}
            />

            {/* 3. Top Scene Counter Badge */}
            <div
              style={{
                position: 'absolute',
                top: 80,
                left: 60,
                zIndex: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '8px 22px',
                borderRadius: 999,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  boxShadow: '0 0 8px #F59E0B',
                }}
              />
              <span
                style={{
                  fontFamily: FONT_FAMILY.mono,
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#CBD5E1',
                  letterSpacing: '1.5px',
                }}
              >
                SCENE {scene.sceneNumber.toString().padStart(2, '0')} /{' '}
                {timeline.scenes.length.toString().padStart(2, '0')}
              </span>
            </div>

            {/* 4. Subtitle Text Overlay */}
            <DynamicSubtitle
              text={scene.text}
              durationInFrames={scene.durationInFrames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
