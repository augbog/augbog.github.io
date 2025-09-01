const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'build', 'index.html');
const dest = path.resolve(__dirname, '..', 'index.html');

if (!fs.existsSync(src)) {
  console.error('Built index.html not found at', src);
  process.exit(1);
}

try {
  const html = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(dest, html);
  console.log('Replaced root index.html with built version.');
} catch (e) {
  console.error('Failed to copy built index.html:', e);
  process.exit(1);
}

