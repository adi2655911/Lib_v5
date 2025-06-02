const fs = require('fs');
const cheerio = require('cheerio');
const bson = require('bson'); // ✅ Fix: import as object

const html = fs.readFileSync('index.html', 'utf-8');
const $ = cheerio.load(html);

const subjects = [];
$('ul.toc li a').each((_, el) => {
  const name = $(el).text().trim();
  const link = $(el).attr('href');
  if (name && link) {
    subjects.push({ name, link });
  }
});

// ✅ Serialize directly with bson.serialize()
const bsonData = bson.serialize({ subjects });

fs.writeFileSync('data/subjects.bson', bsonData);
console.log(`✅ subjects.bson written with ${subjects.length} entries`);