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
import { BackgroundParticles } from '../components/BackgroundParticles';
import { LogoBadge } from '../components/LogoBadge';
import { FONT_FAMILY } from '../styles/fonts';
import { OutroCreditsProps } from '../types/schema';

export const OutroCredits: React.FC<OutroCreditsProps> = ({
  eventTitle,
  closingMessage,
  credits,
  socials,
  theme,
  ttsEnabled = true,
  ttsAudioUrl = 'audio/outro-tts.mp3',
  ttsDelayFrames = 50,
  ttsVolume = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, height } = useVideoConfig();

  const primary = theme?.primaryColor || '#3B82F6';
  const secondary = theme?.secondaryColor || '#06B6D4';
  const accent = theme?.accentColor || '#F59E0B';
  const bg = theme?.backgroundColor || '#0A0F1D';

  // Smooth upward scrolling credit roll calculation for 60fps
  // Total scroll distance based on height and list length
  const scrollDistance = 1400 + credits.length * 220;
  const scrollY = interpolate(
    frame,
    [50, durationInFrames - 120],
    [height * 0.55, -scrollDistance],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Closing banner card emerges near end of credits (last 160 frames at 60fps)
  const closingCardStart = durationInFrames - 160;
  const closingSpring = spring({
    frame: Math.max(0, frame - closingCardStart),
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const closingOpacity = interpolate(closingSpring, [0, 1], [0, 1]);
  const closingScale = interpolate(closingSpring, [0, 1], [0.85, 1]);

  // Overall exit fade-out at the very end (last 30 frames at 60fps)
  const masterFade = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const audioSource =
    ttsAudioUrl.startsWith('http') || ttsAudioUrl.startsWith('data:')
      ? ttsAudioUrl
      : staticFile(ttsAudioUrl);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        opacity: masterFade,
        color: '#FFFFFF',
        fontFamily: FONT_FAMILY.body,
        overflow: 'hidden',
        width: 1080,
        height: 1920,
      }}
    >
      {/* TTS Audio */}
      {ttsEnabled && ttsAudioUrl && (
        <Sequence from={ttsDelayFrames}>
          <Audio src={audioSource} volume={ttsVolume} />
        </Sequence>
      )}

      {/* Motion Background */}
      <BackgroundParticles
        primaryColor={primary}
        secondaryColor={secondary}
        accentColor={accent}
        backgroundColor={bg}
      />

      {/* Fixed Top Header */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 220,
          zIndex: 20,
          background: `linear-gradient(180deg, ${bg} 75%, transparent 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 40,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY.heading,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '3px',
            color: secondary,
            textTransform: 'uppercase',
          }}
        >
          CREDITS & APPRECIATION
        </span>
        <h1
          style={{
            margin: '8px 0 0 0',
            fontFamily: FONT_FAMILY.heading,
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#FFFFFF',
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          {eventTitle}
        </h1>
      </div>

      {/* Scrolling Credits Content */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${scrollY}px)`,
          gap: 72,
          paddingBottom: 300,
        }}
      >
        {credits.map((section, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              width: '88%',
              maxWidth: 880,
            }}
          >
            {/* Division Title Badge */}
            <div
              style={{
                fontFamily: FONT_FAMILY.heading,
                fontSize: 22,
                fontWeight: 800,
                color: accent,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                marginBottom: 20,
                padding: '6px 24px',
                borderRadius: 999,
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              {section.role}
            </div>

            {/* Member Names */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {section.names.map((name, nameIdx) => (
                <span
                  key={nameIdx}
                  style={{
                    fontFamily: FONT_FAMILY.body,
                    fontSize: 28,
                    fontWeight: 600,
                    color: '#F1F5F9',
                    letterSpacing: '0.5px',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Gradient Shadow for smooth exit fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 240,
          zIndex: 15,
          background: `linear-gradient(0deg, ${bg} 60%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Closing Card (Shows in final section with Logo & Socials) */}
      {frame >= closingCardStart && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10, 15, 29, 0.94)',
            backdropFilter: 'blur(16px)',
            opacity: closingOpacity,
            transform: `scale(${closingScale})`,
            gap: 36,
            padding: '60px 48px',
            boxSizing: 'border-box',
          }}
        >
          <LogoBadge
            size={180}
            delay={0}
            primaryColor={primary}
            secondaryColor={secondary}
            accentColor={accent}
            shortName={theme?.himpunanShort || 'HMT'}
          />

          <h2
            style={{
              margin: 0,
              fontFamily: FONT_FAMILY.heading,
              fontSize: 44,
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: '1px',
              maxWidth: 900,
              lineHeight: 1.25,
              background: `linear-gradient(135deg, #FFFFFF 0%, ${secondary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {closingMessage}
          </h2>

          <div
            style={{
              width: 140,
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${primary}, ${accent})`,
            }}
          />

          {/* Social Media Links */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              width: '100%',
              maxWidth: 600,
            }}
          >
            {socials?.instagram && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '14px 28px',
                  borderRadius: 14,
                }}
              >
                <span style={{ fontSize: 24 }}>📸</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY.mono,
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#F8FAFC',
                  }}
                >
                  {socials.instagram}
                </span>
              </div>
            )}

            {socials?.youtube && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '14px 28px',
                  borderRadius: 14,
                }}
              >
                <span style={{ fontSize: 24 }}>▶️</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY.mono,
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#F8FAFC',
                  }}
                >
                  {socials.youtube}
                </span>
              </div>
            )}

            {socials?.website && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '14px 28px',
                  borderRadius: 14,
                }}
              >
                <span style={{ fontSize: 24 }}>🌐</span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY.mono,
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#F8FAFC',
                  }}
                >
                  {socials.website}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
