const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const filePath = process.argv[2];
if (!filePath || !fs.existsSync(filePath)) {
  console.error("❌ Provide valid path to HTML file.");
  process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf-8');
const $ = cheerio.load(html);

// === STEP 1: Extract references (1 format) ===
const references = {};
$('h2').each((_, h2) => {
  const heading = $(h2).text().trim();
  if (heading === 'References') {
    let sibling = $(h2).next();
    while (sibling.length && sibling[0].tagName !== 'h2') {
      const text = sibling.text().trim();
      const match = text.match(/^(\d+)\s*(.*)/);
      if (match) {
        references[match[1]] = match[2];
      }
      sibling = sibling.next();
    }
  }
});

// === STEP 2: Extract from "Continuing Education Activity" through "References" ===
const content = {};
let capturing = false;
let currentSection = '';
let sibling = null;

$('h2').each((_, el) => {
  const heading = $(el).text().trim();

  if (heading === 'Continuing Education Activity') capturing = true;

  if (capturing) {
    currentSection = heading;
    content[currentSection] = '';
    sibling = $(el).next();

    while (sibling.length && sibling[0].tagName !== 'h2') {
      let text = sibling.text().trim();

      // Replace 1 with (reference text)
      text = text.replace(/(\d+)/g, (_, num) =>
        references[num] ? `(${references[num]})` : `[${num}]`
      );

      content[currentSection] += text + '\n\n';
      sibling = sibling.next();
    }

    if (heading === 'References') {
      capturing = false;
    }
  }
});

// === STEP 3: Write to JSON ===
const name = path.basename(filePath, '.html');
const outputPath = path.join('jsondb', `${name}.json`);

fs.mkdirSync('jsondb', { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));

console.log(`✅ JSON saved to ${outputPath}`);