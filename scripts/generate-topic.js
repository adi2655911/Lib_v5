const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function sanitize(link) {
  return link
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function fetchAndCleanHtml(link) {
  const fullUrl = `https://www.ncbi.nlm.nih.gov${link}`;
  const name = sanitize(link);
  const htmlPath = path.join('htmldb', `${name}.html`);

  fs.mkdirSync('htmldb', { recursive: true });

  try {
    // Step 1: Fetch raw HTML
    execSync(`curl -sL "${fullUrl}" -o "${htmlPath}"`);
    console.log(`📥 Fetched ${fullUrl}`);
  } catch (err) {
    console.error(`❌ Failed to fetch URL: ${fullUrl}`);
    console.error(err.message);
    return;
  }

  // Step 2: Extract desired portion
  const rawHtml = fs.readFileSync(htmlPath, 'utf-8').replace(/\n/g, ' ');
  const match = rawHtml.match(
    /<div class="main-content lit-style".*?<h2[^>]*>References<\/h2>.*?<dl.*?>.*?<\/dl>/s
  );

  if (!match) {
    console.error(`❌ Could not extract main content + references for ${name}`);
    return;
  }

  const cleanedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
    h1, h2, h3 { color: #003366; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${match[0]}
</body>
</html>
  `.trim();

  fs.writeFileSync(htmlPath, cleanedHtml);
  console.log(`✅ Saved cleaned HTML to htmldb/${name}.html`);
}

// CLI usage
const link = process.argv[2];
if (!link) {
  console.error('Usage: node scripts/generate-topic.js <relativeLink>');
  process.exit(1);
}

fetchAndCleanHtml(link);