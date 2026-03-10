// Script to regenerate all favicons and replace the default Next.js one
// Run with: node scripts/fix-favicon.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, '../public/logo-icon.png');
const PUBLIC = path.join(__dirname, '../public');
const APP = path.join(__dirname, '../app');

async function fixFavicon() {
  if (!fs.existsSync(SOURCE)) {
    console.error('❌ Source image not found:', SOURCE);
    process.exit(1);
  }

  console.log('🖼️  Source:', SOURCE);

  // 1. Generate 48x48 favicon.ico (PNG format — all modern browsers support it)
  await sharp(SOURCE)
    .resize(48, 48, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'favicon.ico'));
  console.log('✅ public/favicon.ico (48x48)');

  // 2. Generate 32x32 favicon
  await sharp(SOURCE)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'favicon-32.png'));
  console.log('✅ public/favicon-32.png (32x32)');

  // 3. Generate favicon.png
  await sharp(SOURCE)
    .resize(48, 48, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'favicon.png'));
  console.log('✅ public/favicon.png (48x48)');

  // 4. Generate icon.png & icon-192.png (192x192)
  await sharp(SOURCE)
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'icon.png'));
  console.log('✅ public/icon.png (192x192)');

  fs.copyFileSync(path.join(PUBLIC, 'icon.png'), path.join(PUBLIC, 'icon-192.png'));
  console.log('✅ public/icon-192.png (192x192)');

  // 5. Generate icon-512.png
  await sharp(SOURCE)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'icon-512.png'));
  console.log('✅ public/icon-512.png (512x512)');

  // 6. Generate apple-icon.png (180x180)
  await sharp(SOURCE)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, 'apple-icon.png'));
  console.log('✅ public/apple-icon.png (180x180)');

  // 7. Replace app/favicon.ico (the Next.js default one!) with our logo
  const appFavicon = path.join(APP, 'favicon.ico');
  if (fs.existsSync(appFavicon)) {
    // Copy our generated favicon over the default Next.js one
    fs.copyFileSync(path.join(PUBLIC, 'favicon.ico'), appFavicon);
    console.log('✅ app/favicon.ico replaced with logo');
  }

  console.log('\n🎉 Done! All favicons regenerated from logo.');
}

fixFavicon().catch(console.error);
