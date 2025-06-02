const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseUrl = 'https://www.ncbi.nlm.nih.gov';

const link = process.argv[2];
const name = process.argv[3]; // e.g., "Abacavir"

if (!link || !name) {
  console.error('Usage: node fetch-html.js <relativeLink> <name>');
  process.exit(1);
}

const htmlPath = path.join('htmldb', `${name}.html`);
const bsonPath = path.join('db', `${name}.bson`);

if (fs.existsSync(htmlPath) || fs.existsSync(bsonPath)) {
  console.log(`⚠️ Skipping ${name} — already exists.`);
  process.exit(0);
}

fs.mkdirSync('htmldb', { recursive: true });

const fullUrl = `${baseUrl}${link}`;

try {
  execSync(`curl -sL "${fullUrl}" -o "${htmlPath}"`);
  console.log(`✅ HTML saved to ${htmlPath}`);

  // Now auto-generate BSON
  execSync(`node scripts/parse-topic.js "${htmlPath}"`, { stdio: 'inherit' });
  console.log(`✅ BSON saved to db/${name}.bson`);
} catch (err) {
  console.error(`❌ Error during fetch or parse:`, err.message);
}