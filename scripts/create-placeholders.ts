#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  { filename: 'm31.jpg', color: '#8B5CF6', name: 'Andromeda Galaxy' },
  { filename: 'm42.jpg', color: '#06B6D4', name: 'Orion Nebula' },
  { filename: 'm51.jpg', color: '#10B981', name: 'Whirlpool Galaxy' },
  { filename: 'm101.jpg', color: '#F59E0B', name: 'Pinwheel Galaxy' },
  { filename: 'm81.jpg', color: '#EF4444', name: 'Bode\'s Galaxy' },
  { filename: 'm82.jpg', color: '#EC4899', name: 'Cigar Galaxy' },
];

async function createPlaceholderImages() {
  console.log('Creating placeholder images for local development...');
  
  // Create original images
  for (const image of images) {
    const originalPath = path.join('./public/images', image.filename);
    
    await sharp({
      create: {
        width: 1200,
        height: 800,
        channels: 3,
        background: { r: 20, g: 20, b: 20 }
      }
    })
    .composite([
      {
        input: Buffer.from(`
          <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
            <rect width="1200" height="800" fill="${image.color}" opacity="0.3"/>
            <text x="600" y="400" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">
              ${image.name}
            </text>
            <text x="600" y="450" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
              Placeholder Image
            </text>
          </svg>
        `),
        top: 0,
        left: 0,
      }
    ])
    .jpeg({ quality: 80 })
    .toFile(originalPath);
    
    console.log(`Created ${image.filename}`);
  }
  
  // Create thumbnails
  const sizes = [320, 640, 1280];
  
  for (const image of images) {
    const basename = image.filename.replace(/\.[^.]+$/, '');
    
    for (const size of sizes) {
      const thumbPath = path.join('./public/thumbs', size.toString(), `${basename}.webp`);
      
      await sharp(path.join('./public/images', image.filename))
        .resize(size, size, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ quality: 85 })
        .toFile(thumbPath);
      
      console.log(`  Generated ${size}px thumbnail`);
    }
  }
  
  console.log('Placeholder images created successfully!');
}

createPlaceholderImages().catch(console.error);
