const fs = require('fs');
const path = require('path');
const googleTTS = require('google-tts-api');

const FPS = 60;

// Function to generate TTS audio using getAllAudioBase64 to safely handle long sentences (>200 chars)
async function generateTTS(text, filename, lang = 'id') {
  const audioDir = path.join(__dirname, '..', 'public', 'audio');
  fs.mkdirSync(audioDir, { recursive: true });
  const outPath = path.join(audioDir, filename);

  console.log(`🎙️  Generating TTS for "${filename}" (${text.length} chars) [${lang}]...`);

  try {
    // Use getAllAudioBase64 to prevent the 200-char limit exception in Google TTS
    const results = await googleTTS.getAllAudioBase64(text, {
      lang,
      slow: false,
      timeout: 10000,
      splitPunct: '.,!?:;',
    });

    const buffers = results.map((r) => Buffer.from(r.base64, 'base64'));
    const combinedBuffer = Buffer.concat(buffers);

    fs.writeFileSync(outPath, combinedBuffer);
    console.log(`✅ Saved TTS: public/audio/${filename} (${combinedBuffer.length} bytes)`);
    return `audio/${filename}`;
  } catch (err) {
    console.error(`⚠️  TTS generation failed for ${filename}:`, err.message);
    // If audio exists, reuse it, otherwise write empty buffer
    if (!fs.existsSync(outPath)) {
      fs.writeFileSync(outPath, Buffer.alloc(0));
    }
    return `audio/${filename}`;
  }
}

// Robust Markdown Parser for Scene blocks
function parseMarkdown(mdContent) {
  const scenes = [];

  // Match all ## Scene [N] blocks
  const sceneRegex = /##\s+Scene\s+(\d+)\s*\r?\n([\s\S]*?)(?=(?:##\s+Scene\s+\d+|$))/gi;
  let match;

  while ((match = sceneRegex.exec(mdContent)) !== null) {
    const sceneNumber = parseInt(match[1], 10);
    const blockContent = match[2];

    // Extract Waktu
    let startAtSecond = (sceneNumber - 1) * 5;
    let endAtSecond = sceneNumber * 5;
    const waktuMatch = blockContent.match(/Waktu\s*:\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/i);
    if (waktuMatch) {
      startAtSecond = parseFloat(waktuMatch[1]);
      endAtSecond = parseFloat(waktuMatch[2]);
    }

    // Extract Visual
    let visual = `scene-${sceneNumber}.png`;
    const visualMatch = blockContent.match(/Visual\s*:\s*([^\r\n]+)/i);
    if (visualMatch) {
      visual = visualMatch[1].trim();
    }

    // Extract Animasi
    let animation = 'zoom-in';
    const animMatch = blockContent.match(/Animasi\s*:\s*([^\r\n]+)/i);
    if (animMatch) {
      animation = animMatch[1].trim();
    }

    // Extract Teks (handles multi-line text and stops before Catatan: or next section)
    let text = '';
    const textMatch = blockContent.match(/Teks\s*:\s*([\s\S]+?)(?=(?:\r?\n\s*(?:Catatan|Visual|Animasi|Waktu|##|$)))/i);
    if (textMatch) {
      text = textMatch[1].replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // Extract optional Catatan (Notes)
    let notes = '';
    const notesMatch = blockContent.match(/Catatan\s*:\s*([^\r\n]+)/i);
    if (notesMatch) {
      notes = notesMatch[1].trim();
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
      notes,
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

  if (scenes.length === 0) {
    console.error('❌ No scenes found! Please check markdown format (e.g. ## Scene 1)');
    process.exit(1);
  }

  console.log(`Found ${scenes.length} scenes. Generating TTS audio...\n`);

  // Generate TTS for each scene sequentially
  for (const scene of scenes) {
    if (scene.text) {
      const audioFileName = `scene-${scene.sceneNumber}-tts.mp3`;
      await generateTTS(scene.text, audioFileName, 'id');
    }
  }

  // Calculate total video duration from scenes
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
      sceneCount: scenes.length,
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
  console.log(`Total Scenes: ${scenes.length}`);
  console.log(`Total Duration: ${totalDurationInSeconds}s (${totalDurationInFrames} frames @ ${FPS} FPS)`);
  console.log(`========================================\n`);
}

syncMarkdown().catch((err) => {
  console.error('❌ Error syncing markdown:', err);
  process.exit(1);
});
