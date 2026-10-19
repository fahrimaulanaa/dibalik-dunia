const fs = require('fs');
const path = require('path');
const googleTTS = require('google-tts-api');

async function generateTTS(text, filename, lang = 'id') {
  const dir = path.join(__dirname, '..', 'public', 'audio');
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, filename);
  
  console.log(`Generating TTS [${lang}]: "${text}" -> ${filename}...`);
  const b64 = await googleTTS.getAudioBase64(text, { lang, slow: false });
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`✅ Saved: public/audio/${filename}`);
  return `public/audio/${filename}`;
}

async function main() {
  const customText = process.argv[2];
  const customFilename = process.argv[3] || 'custom-tts.mp3';
  const customLang = process.argv[4] || 'id';

  if (customText) {
    await generateTTS(customText, customFilename, customLang);
    return;
  }

  // Default preset batch generation
  await generateTTS(
    'Selamat datang di Dokumentasi FTSL 2024. Membangun sinergi, mengukir prestasi nyata.',
    'intro-tts.mp3',
    'id'
  );

  await generateTTS(
    'Narasumber: Insinyur Muhammad Maul, Magister Teknik. Ketua Umum Himpunan Mahasiswa.',
    'lowerthird-tts.mp3',
    'id'
  );

  await generateTTS(
    'Terima kasih kepada seluruh panitia dan peserta Dokumentasi FTSL 2024. Sampai jumpa di acara berikutnya.',
    'outro-tts.mp3',
    'id'
  );
}

main().catch((err) => {
  console.error('Error generating TTS:', err);
  process.exit(1);
});
