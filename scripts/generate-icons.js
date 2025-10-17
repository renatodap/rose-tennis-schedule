const fs = require('fs');
const path = require('path');

/**
 * Simple icon generator script
 * Creates placeholder PNG icons for PWA
 */

// SVG template for the app icon
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#800000"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}"
        font-weight="bold" fill="white" text-anchor="middle" dy=".35em">
    RH
  </text>
</svg>
`;

const publicDir = path.join(__dirname, '..', 'public');

// Create 192x192 icon
fs.writeFileSync(
  path.join(publicDir, 'icon-192x192.svg'),
  createIconSVG(192).trim()
);

// Create 512x512 icon
fs.writeFileSync(
  path.join(publicDir, 'icon-512x512.svg'),
  createIconSVG(512).trim()
);

console.log('✓ Icon SVG files created in public directory');
console.log('Note: For production, replace these with actual PNG icons');
console.log('You can use tools like:');
console.log('  - https://www.pwabuilder.com/imageGenerator');
console.log('  - https://realfavicongenerator.net/');
