import React from 'react';
import { Composition } from 'remotion';
import { IntroSequence } from './compositions/IntroSequence';
import { LowerThird } from './compositions/LowerThird';
import { OutroCredits } from './compositions/OutroCredits';
import {
  IntroPropsSchema,
  LowerThirdPropsSchema,
  OutroCreditsPropsSchema,
} from './types/schema';

// FORMAT LOCK: 9x16 (1080x1920) @ 60 FPS
const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 60,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. Intro Video (Locked: 9x16 60 FPS, 300 frames = 5 detik) */}
      <Composition
        id="Intro"
        component={IntroSequence}
        durationInFrames={300} // 5 detik @ 60fps
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        schema={IntroPropsSchema}
        defaultProps={{
          eventTitle: 'DOKUMENTASI FTSL 2024',
          subtitle: 'Membangun Sinergi, Mengukir Prestasi Nyata',
          categoryTag: 'OFFICIAL REELS 9:16',
          dateText: '19 OKTOBER 2026',
          locationText: 'AULA BARAT ITB',
          sponsors: [
            { name: 'SPONSORED BY', badgeText: 'BANK BNI' },
            { name: 'MEDIA PARTNER', badgeText: 'KABAR KAMPUS' },
            { name: 'SUPPORTED BY', badgeText: 'IKATAN ALUMNI' },
          ],
          ttsEnabled: true,
          ttsAudioUrl: 'audio/intro-tts.mp3',
          ttsDelayFrames: 25,
          ttsVolume: 1.0,
          theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#06B6D4',
            accentColor: '#F59E0B',
            backgroundColor: '#0A0F1D',
            cardBackground: 'rgba(15, 23, 42, 0.75)',
            textColor: '#FFFFFF',
            subtextColor: '#94A3B8',
            himpunanName: 'HIMPUNAN MAHASISWA TEKNIK',
            himpunanShort: 'HMT-ITB',
          },
        }}
      />

      {/* 2. Lower Third (Locked: 9x16 60 FPS, 420 frames = 7 detik) */}
      <Composition
        id="LowerThird"
        component={LowerThird}
        durationInFrames={420} // 7 detik @ 60fps
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        schema={LowerThirdPropsSchema}
        defaultProps={{
          speakerName: 'Ir. Muhammad Maul, M.T.',
          speakerRole: 'Ketua Umum Himpunan Mahasiswa',
          organization: 'FTSL ITB 2024/2025',
          socialHandle: '@maul.ftsl',
          align: 'left',
          showDemoBackground: true,
          ttsEnabled: true,
          ttsAudioUrl: 'audio/lowerthird-tts.mp3',
          ttsDelayFrames: 25,
          ttsVolume: 1.0,
          theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#06B6D4',
            accentColor: '#F59E0B',
            backgroundColor: '#0A0F1D',
            cardBackground: 'rgba(15, 23, 42, 0.75)',
            textColor: '#FFFFFF',
            subtextColor: '#94A3B8',
            himpunanName: 'HIMPUNAN MAHASISWA TEKNIK',
            himpunanShort: 'HMT-ITB',
          },
        }}
      />

      {/* 3. Outro Credits (Locked: 9x16 60 FPS, 600 frames = 10 detik) */}
      <Composition
        id="OutroCredits"
        component={OutroCredits}
        durationInFrames={600} // 10 detik @ 60fps
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        schema={OutroCreditsPropsSchema}
        defaultProps={{
          eventTitle: 'DOKUMENTASI FTSL 2024',
          closingMessage: 'TERIMA KASIH KEPADA SELURUH PANITIA & PESERTA',
          credits: [
            {
              role: 'PENANGGUNG JAWAB ACARA',
              names: ['Muhammad Maul', 'Fahri Alamsyah'],
            },
            {
              role: 'TIM DOKUMENTASI & PUBLIKASI',
              names: ['Kevin Pratama', 'Siti Rahma', 'Budi Santoso', 'Anisa Putri'],
            },
            {
              role: 'EDITOR VIDEO & MOTION DESIGN',
              names: ['Ahmad Fauzi', 'Rizky Ramadhan'],
            },
            {
              role: 'LOGISTIK & OPERASIONAL',
              names: ['Dewi Lestari', 'Farhan Hidayat', 'Citra Kirana'],
            },
          ],
          socials: {
            instagram: '@himpunan_ftsl',
            youtube: 'Himpunan FTSL Official',
            website: 'himpunan-ftsl.ac.id',
          },
          ttsEnabled: true,
          ttsAudioUrl: 'audio/outro-tts.mp3',
          ttsDelayFrames: 45,
          ttsVolume: 1.0,
          theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#06B6D4',
            accentColor: '#F59E0B',
            backgroundColor: '#0A0F1D',
            cardBackground: 'rgba(15, 23, 42, 0.75)',
            textColor: '#FFFFFF',
            subtextColor: '#94A3B8',
            himpunanName: 'HIMPUNAN MAHASISWA TEKNIK',
            himpunanShort: 'HMT-ITB',
          },
        }}
      />
    </>
  );
};
