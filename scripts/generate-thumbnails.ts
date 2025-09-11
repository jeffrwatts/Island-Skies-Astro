#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const sizes = [320, 640, 1280];
const inputDir = './data/images'; // Directory with original images
const outputDir = './data/thumbs';
const bucketName = 'islandskiesastro-media';

async function generateThumbnails() {
  console.log('Starting thumbnail generation...');
  
  // Read web_images.json to get list of images
  const imagesData = JSON.parse(fs.readFileSync('./data/web_images.json', 'utf8'));
  
  // Create output directories
  sizes.forEach(size => {
    const dir = path.join(outputDir, size.toString());
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  for (const image of imagesData) {
    const inputPath = path.join(inputDir, image.imageFilename);
    const basename = image.imageFilename.replace(/\.[^.]+$/, '');
    
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${image.imageFilename} - file not found`);
      continue;
    }
    
    console.log(`Processing ${image.imageFilename}...`);
    
    for (const size of sizes) {
      const outputPath = path.join(outputDir, size.toString(), `${basename}.webp`);
      
      try {
        await sharp(inputPath)
          .resize(size, size, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .webp({ quality: 85 })
          .toFile(outputPath);
        
        console.log(`  Generated ${size}px thumbnail`);
      } catch (error) {
        console.error(`  Error generating ${size}px thumbnail:`, error);
      }
    }
  }
  
  console.log('Thumbnail generation complete!');
  console.log('\nTo upload to Google Cloud Storage, run:');
  console.log(`gsutil -m cp -r ${outputDir}/* gs://${bucketName}/thumbs/`);
}

// Upload function
async function uploadToGCS() {
  console.log('Uploading thumbnails to Google Cloud Storage...');
  
  try {
    execSync(`gsutil -m cp -r ${outputDir}/* gs://${bucketName}/thumbs/`, { stdio: 'inherit' });
    console.log('Upload complete!');
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

// Main execution
const command = process.argv[2];

if (command === 'upload') {
  uploadToGCS();
} else {
  generateThumbnails();
}
