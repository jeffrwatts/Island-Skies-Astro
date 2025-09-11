import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'data/images';
const outputDir640 = 'public/images/thumbs/640';
const outputDir1080 = 'public/images/thumbs/1080';

async function generateThumbnails() {
  // Ensure output directories exist
  if (!fs.existsSync(outputDir640)) {
    fs.mkdirSync(outputDir640, { recursive: true });
  }
  if (!fs.existsSync(outputDir1080)) {
    fs.mkdirSync(outputDir1080, { recursive: true });
  }

  // Get all image files
  const files = fs.readdirSync(inputDir).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );

  console.log(`Found ${files.length} images to process...`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const basename = path.parse(file).name;
    const outputPath640 = path.join(outputDir640, `${basename}.webp`);
    const outputPath1080 = path.join(outputDir1080, `${basename}.webp`);

    try {
      // Generate 640px thumbnail
      await sharp(inputPath)
        .resize(640, 640, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ quality: 80 })
        .toFile(outputPath640);

      // Generate 1080px thumbnail
      await sharp(inputPath)
        .resize(1080, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ quality: 85 })
        .toFile(outputPath1080);

      console.log(`✓ Generated thumbnails for ${file}`);
    } catch (error) {
      console.error(`✗ Failed to process ${file}:`, error);
    }
  }

  console.log('Thumbnail generation complete!');
}

generateThumbnails().catch(console.error);