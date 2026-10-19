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
import { DynamicSubtitle } from '../components/DynamicSubtitle';
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

// Cinematic Ambient Motion Graphics Particles Layer
const AmbientMotionOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // 6 floating bokeh orbs for high-end cinematic motion graphics
  const orbs = [
    { x: 20, y: 35, size: 300, color: 'rgba(245, 158, 11, 0.12)', speed: 0.8 },
    { x: 80, y: 65, size: 400, color: 'rgba(59, 130, 246, 0.15)', speed: 0.6 },
    { x: 50, y: 85, size: 350, color: 'rgba(234, 88, 12, 0.14)', speed: 0.9 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {orbs.map((orb, i) => {
        const floatX = orb.x + Math.sin(t * orb.speed + i) * 6;
        const floatY = orb.y + Math.cos(t * orb.speed * 0.8 + i) * 8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${floatX}%`,
              top: `${floatY}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* Subtle sweeping light leak overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at ${50 + Math.sin(t * 1.2) * 20}% ${40 + Math.cos(t) * 15}%, rgba(254, 240, 138, 0.08) 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};

// Scene Visual Renderer with Professional Camera Movements & Animations
const SceneVisual: React.FC<{
  visual: string;
  animation: string;
  durationInFrames: number;
}> = ({ visual, animation, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = animation.toLowerCase();

  let scale = 1.0;
  let translateX = 0;
  let translateY = 0;
  let rotate = 0;
  let filter = 'none';

  // Professional camera motions per animation type
  if (anim.includes('slow-scale-up') || anim === 'zoom-in') {
    // Dolly in with smooth breathing
    scale = interpolate(frame, [0, durationInFrames], [1.02, 1.18], {
      extrapolateRight: 'clamp',
    });
    translateY = interpolate(frame, [0, durationInFrames], [0, -25]);
  } else if (anim.includes('pan-up')) {
    translateY = interpolate(frame, [0, durationInFrames], [60, -60], {
      extrapolateRight: 'clamp',
    });
    scale = 1.12;
  } else if (anim.includes('pan-right')) {
    translateX = interpolate(frame, [0, durationInFrames], [-60, 60], {
      extrapolateRight: 'clamp',
    });
    scale = 1.12;
  } else if (anim.includes('glow-pulse')) {
    // Heat pulsing wave
    const pulse = Math.sin((frame / fps) * 6) * 0.04;
    scale = 1.08 + pulse;
    const brightness = 1 + Math.sin((frame / fps) * 8) * 0.18;
    filter = `brightness(${brightness}) contrast(1.05)`;
  } else if (anim.includes('parallax-float')) {
    translateX = Math.sin((frame / fps) * 1.8) * 20;
    translateY = Math.cos((frame / fps) * 2.2) * 18;
    rotate = Math.sin((frame / fps) * 1.5) * 1.2;
    scale = 1.1;
  } else if (anim.includes('spring-bounce')) {
    const bounce = spring({
      frame: Math.max(0, frame - 5),
      fps,
      config: { damping: 11, stiffness: 90 },
    });
    scale = interpolate(bounce, [0, 1], [0.85, 1.05]);
  } else {
    // Default cinematic slow drift
    scale = interpolate(frame, [0, durationInFrames], [1.02, 1.09]);
  }

  // Cross-fade transitions
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

  // Fallback: match .svg if .png was specified in markdown
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
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
          transformOrigin: 'center center',
          filter,
        }}
      />

      {/* Cinematic dark vignette overlay for optimal subtitle readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(5,8,16,0.6) 0%, transparent 28%, rgba(5,8,16,0.15) 60%, rgba(5,8,16,0.92) 100%)',
          pointerEvents: 'none',
        }}
      />
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
            boxShadow: '0 0 16px #EAB308',
          }}
        />
      </div>

      {/* Ambient Motion Graphics Overlay */}
      <AmbientMotionOverlay />

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

            {/* 2. Animated Visual Element with Camera Moves */}
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

            {/* 4. Professional Word-by-Word Dynamic Subtitle Pop-up */}
            <DynamicSubtitle
              text={scene.text}
              startFrame={10}
              durationInFrames={scene.durationInFrames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
