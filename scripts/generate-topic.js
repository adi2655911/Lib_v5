const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const bson = require('bson');
const { execSync } = require('child_process');

function sanitize(link) {
  return link.replace(/[^a-zA-Z0-9_-]/g, '');
}

function fetchAndStore(link) {
  const fullUrl = `https://www.ncbi.nlm.nih.gov${link}`;
  const filename = sanitize(link) + '.html';
  const htmlPath = path.join('temp', filename);
  const bsonPath = path.join('db', sanitize(link) + '.bson');

  // Ensure output folders exist
  fs.mkdirSync('temp', { recursive: true });
  fs.mkdirSync('db', { recursive: true });

  // Fetch HTML
  try {
    execSync(`curl -sL "${fullUrl}" -o ${htmlPath}`);
    console.log(`📥 Fetched ${fullUrl}`);
  } catch (err) {
    console.error(`❌ Failed to fetch URL: ${fullUrl}`);
    console.error(err.message);
    return;
  }

  // Load and parse HTML
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const $ = cheerio.load(html);

  const title = $('h1').first().text().trim();
  const content = $('main, .content, .section').text().trim(); // Adjust selector if needed

  const obj = { title, content, url: link };
  const buffer = bson.serialize(obj);
  fs.writeFileSync(bsonPath, buffer);

  console.log(`✅ Saved parsed topic to ${bsonPath}`);
}

// Run script from CLI
const link = process.argv[2];
if (!link) {
  console.error('Usage: node generate-topic.js <relativeLink>');
  process.exit(1);
}

fetchAndStore(link);