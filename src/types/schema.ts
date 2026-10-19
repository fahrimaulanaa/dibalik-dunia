import { z } from 'zod';

export const BrandThemeSchema = z.object({
  primaryColor: z.string().default('#3B82F6'),
  secondaryColor: z.string().default('#06B6D4'),
  accentColor: z.string().default('#F59E0B'),
  backgroundColor: z.string().default('#0A0F1D'),
  cardBackground: z.string().default('rgba(15, 23, 42, 0.75)'),
  textColor: z.string().default('#FFFFFF'),
  subtextColor: z.string().default('#94A3B8'),
  himpunanName: z.string().default('HIMPUNAN MAHASISWA TEKNIK'),
  himpunanShort: z.string().default('HMT-ITB'),
});

export type BrandTheme = z.infer<typeof BrandThemeSchema>;

export const defaultBrandTheme: BrandTheme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#06B6D4',
  accentColor: '#F59E0B',
  backgroundColor: '#0A0F1D',
  cardBackground: 'rgba(15, 23, 42, 0.75)',
  textColor: '#FFFFFF',
  subtextColor: '#94A3B8',
  himpunanName: 'HIMPUNAN MAHASISWA TEKNIK',
  himpunanShort: 'HMT-ITB',
};

export const SponsorSchema = z.object({
  name: z.string(),
  badgeText: z.string().optional(),
});

export const IntroPropsSchema = z.object({
  eventTitle: z.string().default('DOKUMENTASI FTSL 2024'),
  subtitle: z.string().default('Membangun Sinergi, Mengukir Prestasi Nyata'),
  categoryTag: z.string().default('OFFICIAL REELS 9:16'),
  dateText: z.string().default('19 OKTOBER 2026'),
  locationText: z.string().default('AULA BARAT ITB'),
  logoUrl: z.string().optional(),
  sponsors: z.array(SponsorSchema).default([
    { name: 'SPONSORED BY', badgeText: 'BANK BNI' },
    { name: 'MEDIA PARTNER', badgeText: 'KABAR KAMPUS' },
    { name: 'SUPPORTED BY', badgeText: 'IKATAN ALUMNI' },
  ]),
  theme: BrandThemeSchema.default(defaultBrandTheme),
  // TTS (Text-to-Speech) Props
  ttsEnabled: z.boolean().default(true),
  ttsAudioUrl: z.string().default('audio/intro-tts.mp3'),
  ttsDelayFrames: z.number().default(20),
  ttsVolume: z.number().default(1.0),
});

export type IntroProps = z.infer<typeof IntroPropsSchema>;

export const LowerThirdPropsSchema = z.object({
  speakerName: z.string().default('Ir. Muhammad Maul, M.T.'),
  speakerRole: z.string().default('Ketua Umum Himpunan Mahasiswa'),
  organization: z.string().default('FTSL ITB 2024/2025'),
  socialHandle: z.string().default('@maul.ftsl'),
  theme: BrandThemeSchema.default(defaultBrandTheme),
  align: z.enum(['left', 'center']).default('left'),
  showDemoBackground: z.boolean().default(true),
  // TTS (Text-to-Speech) Props
  ttsEnabled: z.boolean().default(true),
  ttsAudioUrl: z.string().default('audio/lowerthird-tts.mp3'),
  ttsDelayFrames: z.number().default(25),
  ttsVolume: z.number().default(1.0),
});

export type LowerThirdProps = z.infer<typeof LowerThirdPropsSchema>;

export const CreditItemSchema = z.object({
  role: z.string(),
  names: z.array(z.string()),
});

export const OutroCreditsPropsSchema = z.object({
  eventTitle: z.string().default('DOKUMENTASI FTSL 2024'),
  closingMessage: z.string().default('TERIMA KASIH KEPADA SELURUH PANITIA & PESERTA'),
  credits: z.array(CreditItemSchema).default([
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
  ]),
  socials: z.object({
    instagram: z.string().default('@himpunan_ftsl'),
    youtube: z.string().default('Himpunan FTSL Official'),
    website: z.string().default('himpunan-ftsl.ac.id'),
  }).default({
    instagram: '@himpunan_ftsl',
    youtube: 'Himpunan FTSL Official',
    website: 'himpunan-ftsl.ac.id',
  }),
  theme: BrandThemeSchema.default(defaultBrandTheme),
  // TTS (Text-to-Speech) Props
  ttsEnabled: z.boolean().default(true),
  ttsAudioUrl: z.string().default('audio/outro-tts.mp3'),
  ttsDelayFrames: z.number().default(30),
  ttsVolume: z.number().default(1.0),
});

export type OutroCreditsProps = z.infer<typeof OutroCreditsPropsSchema>;
