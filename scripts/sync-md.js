const fs = require('fs');
const path = require('path');
const googleTTS = require('google-tts-api');

const FPS = 60;

// Function to generate TTS audio and save to public/audio/
async function generateTTS(text, filename, lang = 'id') {
  const audioDir = path.join(__dirname, '..', 'public', 'audio');
  fs.mkdirSync(audioDir, { recursive: true });
  const outPath = path.join(audioDir, filename);

  console.log(`🎙️  Generating TTS for "${filename}" [${lang}]: "${text}"`);
  const b64 = await googleTTS.getAudioBase64(text, { lang, slow: false });
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`✅ Saved TTS: public/audio/${filename}`);
  return `audio/${filename}`;
}

// Function to parse the Markdown content into scenes
function parseMarkdown(mdContent) {
  // Split content by scene headers (e.g. ## Scene 1, ## Scene 2)
  const sceneBlocks = mdContent
    .split(/^##\s+Scene\s+/im)
    .filter((block) => block.trim().length > 0);

  const scenes = [];

  for (let i = 0; i < sceneBlocks.length; i++) {
    const block = sceneBlocks[i];
    const lines = block.split('\n').map((line) => line.trim());

    // Extract scene number (from the first line of the block if it started with the number)
    const firstLineMatch = lines[0].match(/^(\d+)/);
    const sceneNumber = firstLineMatch ? parseInt(firstLineMatch[1], 10) : i + 1;

    let startAtSecond = 0;
    let endAtSecond = 5;
    let visual = '';
    let animation = 'zoom-in';
    let text = '';

    for (const line of lines) {
      if (/^waktu\s*:/i.test(line)) {
        const timeMatch = line.match(/^waktu\s*:\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/i);
        if (timeMatch) {
          startAtSecond = parseFloat(timeMatch[1]);
          endAtSecond = parseFloat(timeMatch[2]);
        }
      } else if (/^visual\s*:/i.test(line)) {
        visual = line.replace(/^visual\s*:\s*/i, '').trim();
      } else if (/^animasi\s*:/i.test(line)) {
        animation = line.replace(/^animasi\s*:\s*/i, '').trim().toLowerCase();
      } else if (/^teks\s*:/i.test(line)) {
        text = line.replace(/^teks\s*:\s*/i, '').trim();
      }
    }

    const durationSeconds = Math.max(1, endAtSecond - startAtSecond);
    const fromFrame = Math.round(startAtSecond * FPS);
    const durationInFrames = Math.round(durationSeconds * FPS);
    const audioFileName = `scene-${sceneNumber}-tts.mp3`;

    scenes.push({
      id: `scene-${sceneNumber}`,
      sceneNumber,
      startAtSecond,
      endAtSecond,
      durationSeconds,
      fromFrame,
      durationInFrames,
      visual,
      animation,
      text,
      audioFile: `audio/${audioFileName}`,
    });
  }

  return scenes;
}

async function syncMarkdown() {
  const inputMdPath =
    process.argv[2] || path.join(__dirname, '..', 'src', 'content', 'brief-lampu.md');

  if (!fs.existsSync(inputMdPath)) {
    console.error(`❌ File not found: ${inputMdPath}`);
    process.exit(1);
  }

  console.log(`\n========================================`);
  console.log(`📄 Reading Markdown: ${inputMdPath}`);
  console.log(`========================================\n`);

  const mdContent = fs.readFileSync(inputMdPath, 'utf-8');
  const scenes = parseMarkdown(mdContent);

  console.log(`Found ${scenes.length} scenes. Generating TTS audio...\n`);

  // Generate TTS for each scene
  for (const scene of scenes) {
    if (scene.text) {
      const audioFileName = `scene-${scene.sceneNumber}-tts.mp3`;
      await generateTTS(scene.text, audioFileName, 'id');
    }
  }

  // Calculate total duration
  const totalDurationInSeconds = Math.max(
    ...scenes.map((s) => s.endAtSecond),
    0
  );
  const totalDurationInFrames = Math.round(totalDurationInSeconds * FPS);

  const timelineData = {
    metadata: {
      sourceFile: path.basename(inputMdPath),
      generatedAt: new Date().toISOString(),
      fps: FPS,
      width: 1080,
      height: 1920,
      totalDurationInSeconds,
      totalDurationInFrames,
    },
    scenes,
  };

  const outputJsonPath = path.join(
    __dirname,
    '..',
    'src',
    'content',
    'timeline.json'
  );

  fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
  fs.writeFileSync(outputJsonPath, JSON.stringify(timelineData, null, 2));

  console.log(`\n========================================`);
  console.log(`✅ Success! Timeline generated: ${outputJsonPath}`);
  console.log(`Total Duration: ${totalDurationInSeconds}s (${totalDurationInFrames} frames @ ${FPS} FPS)`);
  console.log(`========================================\n`);
}

syncMarkdown().catch((err) => {
  console.error('❌ Error syncing markdown:', err);
  process.exit(1);
});
