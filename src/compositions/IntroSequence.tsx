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
import { AnimatedText } from '../components/AnimatedText';
import { BackgroundParticles } from '../components/BackgroundParticles';
import { LogoBadge } from '../components/LogoBadge';
import { FONT_FAMILY } from '../styles/fonts';
import { IntroProps } from '../types/schema';

export const IntroSequence: React.FC<IntroProps> = ({
  eventTitle,
  subtitle,
  categoryTag,
  dateText,
  locationText,
  logoUrl,
  sponsors,
  theme,
  ttsEnabled = true,
  ttsAudioUrl = 'audio/intro-tts.mp3',
  ttsDelayFrames = 25,
  ttsVolume = 1.0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Master fade-out near the end (last 30 frames at 60fps)
  const exitProgress = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Badge Spring Animation (scaled for 60fps)
  const badgeSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);
  const badgeTranslateY = interpolate(badgeSpring, [0, 1], [-30, 0]);

  // Subtitle & Info Spring Animation
  const subtitleSpring = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);
  const subtitleTranslateY = interpolate(subtitleSpring, [0, 1], [40, 0]);

  // Bottom Sponsors Bar Spring Animation
  const sponsorSpring = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 15, stiffness: 95 },
  });
  const sponsorOpacity = interpolate(sponsorSpring, [0, 1], [0, 1]);

  const primary = theme?.primaryColor || '#3B82F6';
  const secondary = theme?.secondaryColor || '#06B6D4';
  const accent = theme?.accentColor || '#F59E0B';
  const bg = theme?.backgroundColor || '#0A0F1D';

  const audioSource =
    ttsAudioUrl.startsWith('http') || ttsAudioUrl.startsWith('data:')
      ? ttsAudioUrl
      : staticFile(ttsAudioUrl);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        opacity: exitProgress,
        color: '#FFFFFF',
        fontFamily: FONT_FAMILY.body,
        overflow: 'hidden',
        width: 1080,
        height: 1920,
      }}
    >
      {/* TTS Voiceover Audio */}
      {ttsEnabled && ttsAudioUrl && (
        <Sequence from={ttsDelayFrames}>
          <Audio src={audioSource} volume={ttsVolume} />
        </Sequence>
      )}

      {/* Dynamic Background Particles & Gradients */}
      <BackgroundParticles
        primaryColor={primary}
        secondaryColor={secondary}
        accentColor={accent}
        backgroundColor={bg}
      />

      {/* 9:16 Vertical Content Layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '160px 56px 140px 56px',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Section: Logo & Category Pill */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <LogoBadge
            logoUrl={logoUrl}
            size={180}
            delay={10}
            primaryColor={primary}
            secondaryColor={secondary}
            accentColor={accent}
            shortName={theme?.himpunanShort || 'HMT'}
          />

          {categoryTag && (
            <div
              style={{
                opacity: badgeOpacity,
                transform: `translateY(${badgeTranslateY}px)`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 24px',
                borderRadius: 999,
                background: `linear-gradient(90deg, ${primary}25 0%, ${secondary}25 100%)`,
                border: `1px solid ${secondary}66`,
                boxShadow: `0 0 20px ${secondary}33`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: accent,
                  boxShadow: `0 0 10px ${accent}`,
                }}
              />
              <span
                style={{
                  fontFamily: FONT_FAMILY.heading,
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: '3px',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                {categoryTag}
              </span>
            </div>
          )}
        </div>

        {/* Center Headline: Event Title & Subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            gap: 22,
          }}
        >
          <AnimatedText
            text={eventTitle}
            delay={30}
            fontSize={72}
            fontWeight={900}
            letterSpacing={2}
            gradient={`linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 60%, ${secondary} 100%)`}
            textAlign="center"
          />

          {subtitle && (
            <div
              style={{
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleTranslateY}px)`,
                maxWidth: '920px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: FONT_FAMILY.body,
                  fontSize: 26,
                  fontWeight: 400,
                  color: '#CBD5E1',
                  lineHeight: 1.45,
                  letterSpacing: '0.5px',
                }}
              >
                {subtitle}
              </p>
            </div>
          )}

          {/* Date & Location Chips */}
          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleTranslateY}px)`,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              marginTop: 12,
            }}
          >
            {dateText && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 20,
                  fontWeight: 600,
                  color: secondary,
                  background: 'rgba(15, 23, 42, 0.75)',
                  padding: '8px 20px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span>📅</span>
                <span>{dateText}</span>
              </div>
            )}
            {locationText && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#E2E8F0',
                  background: 'rgba(15, 23, 42, 0.75)',
                  padding: '8px 20px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span>📍</span>
                <span>{locationText}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sponsors & Partners Row */}
        {sponsors && sponsors.length > 0 && (
          <div
            style={{
              opacity: sponsorOpacity,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: '75%',
                height: 1,
                background: `linear-gradient(90deg, transparent, ${secondary}66, transparent)`,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 14,
                alignItems: 'center',
              }}
            >
              {sponsors.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '8px 22px',
                    borderRadius: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#94A3B8',
                      letterSpacing: '1.2px',
                    }}
                  >
                    {s.name}
                  </span>
                  {s.badgeText && (
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#F8FAFC',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {s.badgeText}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
