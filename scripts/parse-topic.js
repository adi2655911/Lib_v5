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

// Select all section headers starting from "Introduction" up to "References"
const headings = $('h2');
const content = {};
let capturing = false;
let currentSection = '';

headings.each((i, elem) => {
  const heading = $(elem).text().trim();

  if (heading === 'Introduction') capturing = true;
  if (heading === 'References') capturing = false;

  if (capturing) {
    currentSection = heading;
    content[currentSection] = '';
    let sibling = $(elem).next();

    while (sibling.length && sibling[0].tagName !== 'h2') {
      content[currentSection] += sibling.text().trim() + '\n\n';
      sibling = sibling.next();
    }
  }
});

const outputFile = filePath.replace(/\.html$/, '.json');
fs.writeFileSync(outputFile, JSON.stringify(content, null, 2));
console.log(`✅ JSON saved to ${outputFile}`);