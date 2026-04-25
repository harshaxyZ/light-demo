const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDirs = {
  day: 'images-day',
  night: 'images-night'
};

const outputDir = 'images-optimized';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
if (!fs.existsSync(path.join(outputDir, 'day'))) fs.mkdirSync(path.join(outputDir, 'day'));
if (!fs.existsSync(path.join(outputDir, 'night'))) fs.mkdirSync(path.join(outputDir, 'night'));

async function optimize() {
  for (const [type, dir] of Object.entries(inputDirs)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg'));
    
    for (const file of files) {
      const inputPath = path.join(dir, file);
      const outputName = file.replace(/\.(jpeg|jpg)$/, '.webp');
      const outputPath = path.join(outputDir, type, outputName);
      
      console.log(`Optimizing ${inputPath}...`);
      
      await sharp(inputPath)
        .resize(1000) // Resize to 1000px width
        .webp({ quality: 80 }) // Convert to WebP with good quality
        .toFile(outputPath);
        
      const stats = fs.statSync(outputPath);
      console.log(`Saved ${outputPath} (${(stats.size / 1024).toFixed(2)} KB)`);
      
      if (stats.size > 200 * 1024) {
        console.warn(`Warning: ${outputPath} is over 200KB. Re-optimizing...`);
        await sharp(inputPath)
          .resize(800) // Smaller resize
          .webp({ quality: 70 })
          .toFile(outputPath);
        console.log(`Re-saved ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB)`);
      }
    }
  }
}

optimize().catch(console.error);
