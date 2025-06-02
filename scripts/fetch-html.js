// This file fetches topic info from StatPearls using curl
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseUrl = 'https://www.ncbi.nlm.nih.gov';

// CLI usage: node fetch-html.js <relativeLink> <name>
const link = process.argv[2];
const name = process.argv[3]; // e.g., "Abacavir"

if (!link || !name) {
  console.error('Usage: node fetch-html.js <relativeLink> <name>');
  process.exit(1);
}

const htmlPath = path.join('htmldb', `${name}.html`);
const bsonPath = path.join('db', `${name}.bson`);

// Skip if already exists
if (fs.existsSync(htmlPath) || fs.existsSync(bsonPath)) {
  console.log(`⚠️ Skipping ${name} — already exists.`);
  process.exit(0);
}

// Ensure output folder exists
fs.mkdirSync('htmldb', { recursive: true });

const fullUrl = `${baseUrl}${link}`;

try {
  execSync(`curl -sL "${fullUrl}" -o "${htmlPath}"`);
  console.log(`✅ Saved HTML to ${htmlPath}`);
} catch (err) {
  console.error(`❌ Failed to fetch ${fullUrl}:`, err.message);
  process.exit(1);
}