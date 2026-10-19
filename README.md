# Remotion Event Video Generator (9:16 60 FPS Locked + TTS) 🎬⚡

Sistem generator video motion graphics otomatis berbasis **React & Remotion** yang **DIKUNCI pada format 9:16 (1080x1920) @ 60 FPS** dan dilengkapi integrasi **TTS (Text-to-Speech)** suara voiceover otomatis.

Didesain khusus untuk **Maul & Tim Media Himpunan** agar dapat memproduksi video dokumentasi media sosial (Reels, TikTok, YouTube Shorts) dalam hitungan detik tanpa perlu membuka After Effects.

---

## 🔒 Spesifikasi Output Terkunci (Locked Output)

| Parameter | Spesifikasi | Keterangan |
| :--- | :--- | :--- |
| **Resolusi** | `1080 x 1920` | **9:16 Vertical Video (Reels / TikTok / Shorts)** |
| **Frame Rate** | **60 FPS** | Ultra-smooth motion graphics & spring animation |
| **Audio** | **TTS Voiceover** | Otomatis disinkronkan dengan kemunculan logo dan teks |
| **Codec** | `H.264 / AAC` | Kompatibel penuh untuk media sosial dan editing software |

---

## 🎙️ Fitur TTS (Text-to-Speech)

Sistem telah dilengkapi modul TTS berbasis Google TTS (bahasa Indonesia & Inggris):
- **Voiceover Otomatis**: Menghasilkan suara narator yang membacakan judul event, nama narasumber, atau ucapan penutup.
- **Generator CLI Cepat**: Jalankan perintah sederhana untuk membuat voiceover kustom secara instan:
  ```bash
  # Menghasilkan preset suara default
  npm run tts

  # Menghasilkan suara dari teks bebas kustom
  node scripts/generate-tts.js "Selamat datang di Acara Himpunan Mahasiswa 2026" custom-tts.mp3 id
  ```
- **Sinkronisasi Presisi**: Dilengkapi prop `ttsDelayFrames` untuk mengatur timing detik/frame tepat saat teks atau logo muncul.

---

## 📁 Struktur Proyek

```
dibalik dunia/
├── events/                          # File konfigurasi JSON event
│   ├── ftsl-2024.json              # Data event FTSL 2024
│   ├── workshop-ai.json            # Data event Workshop AI
│   ├── lowerthird-speaker.json     # Data lower third narasumber
│   └── outro-panitia.json          # Data outro panitia
├── public/audio/                    # Aset audio TTS yang dihasilkan
│   ├── intro-tts.mp3               # Voiceover intro
│   ├── lowerthird-tts.mp3          # Voiceover lower third narasumber
│   └── outro-tts.mp3               # Voiceover penutup outro
├── out/                             # Direktori output video .mp4 (9:16 60 FPS)
│   ├── intro-9x16-60fps.mp4        # Video Intro 9:16 60 FPS + TTS
│   ├── lowerthird-9x16-60fps.mp4   # Video Lower Third 9:16 60 FPS + TTS
│   └── outro-9x16-60fps.mp4        # Video Outro 9:16 60 FPS + TTS
├── scripts/
│   └── generate-tts.js             # Generator TTS otomatis
├── src/
│   ├── components/                 # AnimatedText, BackgroundParticles, LogoBadge
│   ├── compositions/               # IntroSequence, LowerThird, OutroCredits
│   ├── styles/                     # Google Fonts loader (Outfit, Montserrat, Inter)
│   ├── types/                      # Zod schema dengan properti TTS
│   ├── Root.tsx                    # Locked 9:16 60 FPS Compositions
│   └── index.ts                    # Remotion entrypoint
├── package.json
└── remotion.config.ts
```

---

## 🚀 Perintah Render CLI

```bash
# 1. Buka Remotion Studio untuk visual preview langsung
npm start

# 2. Generate / Perbarui file audio TTS
npm run tts

# 3. Render video 9:16 60 FPS dengan TTS
npm run render:intro          # Render out/intro-9x16-60fps.mp4 (5s @ 60fps)
npm run render:lowerthird     # Render out/lowerthird-9x16-60fps.mp4 (7s @ 60fps)
npm run render:outro          # Render out/outro-9x16-60fps.mp4 (10s @ 60fps)
npm run render:all            # Render ketiga video sekaligus
```
