// Generates public/og.png (social preview) and public/apple-touch-icon.png.
// Run: node scripts/make-images.mjs
import sharp from 'sharp';

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx="10%" cy="0%" r="70%"><stop offset="0" stop-color="#4f46e5" stop-opacity=".7"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="100%" cy="100%" r="60%"><stop offset="0" stop-color="#7c3aed" stop-opacity=".6"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
    <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c4b8ff"/><stop offset="1" stop-color="#8b7cff"/></linearGradient>
    <linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b7cff"/><stop offset="1" stop-color="#5b4bdb"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#09090b"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <rect x="80" y="80" width="64" height="64" rx="18" fill="url(#l)"/>
  <text x="112" y="124" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff">F</text>
  <text x="164" y="122" font-family="Helvetica Neue, Arial, sans-serif" font-size="28" font-weight="700" fill="#fafafa">Faxriddin<tspan fill="#71717a" font-weight="500">.dev</tspan></text>
  <text x="80" y="300" font-family="Helvetica Neue, Arial, sans-serif" font-size="96" font-weight="800" fill="url(#t)" letter-spacing="-3">Faxriddin</text>
  <text x="80" y="400" font-family="Helvetica Neue, Arial, sans-serif" font-size="96" font-weight="800" fill="#fafafa" letter-spacing="-3">Mo‘ydinxonov</text>
  <text x="80" y="480" font-family="Helvetica Neue, Arial, sans-serif" font-size="34" font-weight="600" fill="#c4b8ff">iOS Developer · Swift &amp; SwiftUI</text>
  <text x="80" y="540" font-family="Helvetica Neue, Arial, sans-serif" font-size="24" fill="#a1a1aa">Tashkent, Uzbekistan</text>
</svg>`;

const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b7cff"/><stop offset="1" stop-color="#5b4bdb"/></linearGradient></defs>
  <rect width="180" height="180" fill="url(#l)"/>
  <text x="90" y="122" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-size="96" font-weight="800" fill="#fff">F</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile('public/og.png');
await sharp(Buffer.from(icon)).png().toFile('public/apple-touch-icon.png');
console.log('ok');
