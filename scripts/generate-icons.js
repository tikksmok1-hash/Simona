// Script to generate favicon and app icons from the logo image
// Run with: node scripts/generate-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_IMAGE = path.join(__dirname, '../public/logo-icon.png');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateIcons() {
  console.log('Generating icons from:', SOURCE_IMAGE);
  
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error('Source image not found:', SOURCE_IMAGE);
    process.exit(1);
  }

  try {
    // Generate favicon.ico (32x32)
    await sharp(SOURCE_IMAGE)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-32.png'));
    console.log('✓ favicon-32.png generated');

    // Generate icon.png (192x192)
    await sharp(SOURCE_IMAGE)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'icon.png'));
    console.log('✓ icon.png (192x192) generated');

    // Generate icon-192.png
    await sharp(SOURCE_IMAGE)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'icon-192.png'));
    console.log('✓ icon-192.png generated');

    // Generate icon-512.png
    await sharp(SOURCE_IMAGE)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'icon-512.png'));
    console.log('✓ icon-512.png (512x512) generated');

    // Generate apple-icon.png (180x180)
    await sharp(SOURCE_IMAGE)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'apple-icon.png'));
    console.log('✓ apple-icon.png (180x180) generated');

    // Generate favicon.ico (we'll create a 32x32 PNG and rename it - browsers support PNG favicons)
    await sharp(SOURCE_IMAGE)
      .resize(48, 48, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon.png'));
    
    // Copy as .ico (modern browsers handle PNG as ico)
    fs.copyFileSync(
      path.join(PUBLIC_DIR, 'favicon.png'),
      path.join(PUBLIC_DIR, 'favicon.ico')
    );
    console.log('✓ favicon.ico generated');

    console.log('\n✅ All icons generated successfully!');
    console.log('Files created in:', PUBLIC_DIR);
    
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
