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
  };
  scenes: SceneItem[];
}

interface MainVideoProps {
  timeline?: TimelineData;
}

// Scene Visual Renderer with Dynamic Animation (zoom-in, pan-right, etc.)
const SceneVisual: React.FC<{
  visual: string;
  animation: string;
  durationInFrames: number;
}> = ({ visual, animation, durationInFrames }) => {
  const frame = useCurrentFrame();

  // Animation logic
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  if (animation === 'zoom-in') {
    scale = interpolate(frame, [0, durationInFrames], [1, 1.14], {
      extrapolateRight: 'clamp',
    });
  } else if (animation === 'zoom-out') {
    scale = interpolate(frame, [0, durationInFrames], [1.14, 1], {
      extrapolateRight: 'clamp',
    });
  } else if (animation === 'pan-right') {
    translateX = interpolate(frame, [0, durationInFrames], [-50, 50], {
      extrapolateRight: 'clamp',
    });
    scale = 1.08; // slightly enlarged so panning doesn't reveal edges
  } else if (animation === 'pan-left') {
    translateX = interpolate(frame, [0, durationInFrames], [50, -50], {
      extrapolateRight: 'clamp',
    });
    scale = 1.08;
  } else {
    // Default subtle float
    scale = interpolate(frame, [0, durationInFrames], [1, 1.05]);
  }

  // Cross-fade entrance and exit per scene
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Visual source path: looks in public/visuals/ or public/
  const imageSrc = visual.startsWith('http')
    ? visual
    : staticFile(`visuals/${visual}`);

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
        }}
      />

      {/* Cinematic dark gradient vignette overlay for subtitle readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(10,15,30,0.6) 0%, transparent 35%, rgba(5,8,16,0.3) 60%, rgba(5,8,16,0.92) 100%)',
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

  const translateY = interpolate(popSpring, [0, 1], [40, 0]);
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

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 340, // Positioned safely above TikTok/Reels bottom captions
        left: 60,
        right: 60,
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
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(253, 224, 71, 0.4)', // glowing warm yellow accent
          boxShadow:
            '0 20px 48px rgba(0, 0, 0, 0.75), 0 0 24px rgba(253, 224, 71, 0.2)',
          borderRadius: 24,
          padding: '24px 36px',
          maxWidth: '920px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT_FAMILY.heading,
            fontSize: 38,
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.35,
            letterSpacing: '0.4px',
            textShadow: '0 2px 14px rgba(0,0,0,0.8)',
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
          height: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          zIndex: 50,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #3B82F6, #F59E0B)',
            boxShadow: '0 0 12px #F59E0B',
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
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '8px 20px',
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
