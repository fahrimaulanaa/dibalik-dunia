import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { FONT_FAMILY } from '../styles/fonts';
import { LowerThirdProps } from '../types/schema';

export const LowerThird: React.FC<LowerThirdProps> = ({
  speakerName,
  speakerRole,
  organization,
  socialHandle,
  theme,
  showDemoBackground = true,
  ttsEnabled = true,
  ttsAudioUrl = 'audio/lowerthird-tts.mp3',
  ttsDelayFrames = 25,
  ttsVolume = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const primary = theme?.primaryColor || '#3B82F6';
  const secondary = theme?.secondaryColor || '#06B6D4';
  const accent = theme?.accentColor || '#F59E0B';

  // Entry animation (starts at frame 15, scaled for 60fps)
  const enterSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: {
      damping: 15,
      stiffness: 110,
      mass: 0.85,
    },
  });

  // Exit animation (starts 40 frames before duration end @ 60fps)
  const exitDuration = 40;
  const exitStartFrame = durationInFrames - exitDuration;
  const exitProgress = interpolate(
    frame,
    [exitStartFrame, durationInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const enterTranslateX = interpolate(enterSpring, [0, 1], [-140, 0]);
  const enterOpacity = interpolate(enterSpring, [0, 1], [0, 1]);

  const exitTranslateX = interpolate(exitProgress, [0, 1], [0, -100]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const finalTranslateX = enterTranslateX + exitTranslateX;
  const finalOpacity = Math.min(enterOpacity, exitOpacity);

  // Accent bar expansion
  const barProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 15, stiffness: 130 },
  });
  const barScaleY = interpolate(barProgress, [0, 1], [0, 1]);

  // Long text down-scaling for vertical canvas (1080 width)
  const nameLength = speakerName.length;
  const nameFontSize = nameLength > 28 ? 32 : nameLength > 20 ? 38 : 44;

  const audioSource =
    ttsAudioUrl.startsWith('http') || ttsAudioUrl.startsWith('data:')
      ? ttsAudioUrl
      : staticFile(ttsAudioUrl);

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* TTS Audio */}
      {ttsEnabled && ttsAudioUrl && (
        <Sequence from={ttsDelayFrames}>
          <Audio src={audioSource} volume={ttsVolume} />
        </Sequence>
      )}

      {/* Optional Interview/Preview Background Mock for 9:16 vertical */}
      {showDemoBackground && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle at 50% 35%, #172554 0%, #0B1120 60%, #030712 100%)',
            opacity: 0.95,
          }}
        >
          {/* Subtle interview vertical spotlight */}
          <div
            style={{
              position: 'absolute',
              top: '25%',
              left: '20%',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primary}20 0%, transparent 70%)`,
              filter: 'blur(50px)',
            }}
          />
          {/* Safe zone indicator header */}
          <div
            style={{
              position: 'absolute',
              top: 100,
              left: 60,
              color: 'rgba(255,255,255,0.35)',
              fontFamily: FONT_FAMILY.mono,
              fontSize: 16,
              letterSpacing: '1px',
            }}
          >
            ● 9:16 VERTICAL 60FPS OVERLAY
          </div>
        </div>
      )}

      {/* Lower Third Anchor: Above TikTok/Reels bottom action bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 320,
          left: 56,
          right: 56,
          opacity: finalOpacity,
          transform: `translateX(${finalTranslateX}px)`,
          display: 'flex',
          alignItems: 'stretch',
          maxWidth: '968px',
        }}
      >
        {/* Vertical Glowing Accent Bar */}
        <div
          style={{
            width: 8,
            borderRadius: 6,
            background: `linear-gradient(180deg, ${accent} 0%, ${secondary} 60%, ${primary} 100%)`,
            transform: `scaleY(${barScaleY})`,
            transformOrigin: 'bottom',
            boxShadow: `0 0 20px ${secondary}99`,
            marginRight: 18,
          }}
        />

        {/* Content Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
          }}
        >
          {/* Name & Organization Badge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '16px 28px',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.7)',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: FONT_FAMILY.heading,
                fontSize: nameFontSize,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.5px',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                wordBreak: 'break-word',
              }}
            >
              {speakerName}
            </h2>

            {organization && (
              <span
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: FONT_FAMILY.body,
                  color: secondary,
                  background: `${secondary}20`,
                  border: `1px solid ${secondary}55`,
                  padding: '4px 14px',
                  borderRadius: 6,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {organization}
              </span>
            )}
          </div>

          {/* Sub-bar: Role & Social */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {speakerRole && (
              <div
                style={{
                  background: `linear-gradient(90deg, ${primary}EE 0%, ${secondary}CC 100%)`,
                  padding: '8px 22px',
                  borderRadius: 10,
                  boxShadow: `0 4px 16px ${primary}44`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY.body,
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    letterSpacing: '0.4px',
                  }}
                >
                  {speakerRole}
                </span>
              </div>
            )}

            {socialHandle && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '8px 18px',
                  borderRadius: 10,
                  color: '#CBD5E1',
                  fontSize: 18,
                  fontFamily: FONT_FAMILY.mono,
                  fontWeight: 500,
                }}
              >
                <span style={{ color: accent, fontSize: 16 }}>★</span>
                <span>{socialHandle}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
