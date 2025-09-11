import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const inputDir = 'data/images';
const outputDir = 'temp-thumbs-1080';

async function generateThumbnails() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all image files
  const files = fs.readdirSync(inputDir).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  console.log(`Found ${files.length} images to process...`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const basename = path.parse(file).name;
    const outputPath = path.join(outputDir, `${basename}.webp`);

    try {
      await sharp(inputPath)
        .resize(1080, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`✓ Generated thumbnail for ${file}`);
    } catch (error) {
      console.error(`✗ Failed to process ${file}:`, error);
    }
  }

  console.log('Thumbnail generation complete!');
  
  // Upload to GCS
  console.log('Uploading thumbnails to GCS...');
  try {
    execSync(`gsutil -m cp -r ${outputDir}/* gs://islandskiesastro-media/thumbs/1080/`, { stdio: 'inherit' });
    console.log('✓ Upload complete!');
  } catch (error) {
    console.error('✗ Upload failed:', error);
  }

  // Clean up temp directory
  fs.rmSync(outputDir, { recursive: true, force: true });
  console.log('✓ Cleanup complete!');
}

generateThumbnails().catch(console.error);
