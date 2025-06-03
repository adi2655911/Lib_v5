const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

const baseUrl = 'https://www.ncbi.nlm.nih.gov';

const link = process.argv[2];
const name = process.argv[3];

if (!link || !name) {
  console.error('Usage: node fetch-html.js <relativeLink> <name>');
  process.exit(1);
}

const htmlPath = path.join('htmldb', `${name}.html`);

if (fs.existsSync(htmlPath)) {
  console.log(`⚠️ Skipping ${name} — already exists.`);
  process.exit(0);
}

fs.mkdirSync('htmldb', { recursive: true });

const fullUrl = `${baseUrl}${link}`;

try {
  // Step 1: Fetch
  execSync(`curl -sL "${fullUrl}" -o "${htmlPath}"`);
  console.log(`✅ Raw HTML saved to ${htmlPath}`);

  // Step 2: Extract main section
  const rawHtml = fs.readFileSync(htmlPath, 'utf-8').replace(/\n/g, ' ');
  const match = rawHtml.match(
    /<div class="main-content lit-style".*?<h2[^>]*>References<\/h2>.*?<dl.*?>.*?<\/dl>/s
  );

  if (!match) {
    console.error(`❌ Could not extract useful content from ${name}`);
    process.exit(1);
  }

  const $ = cheerio.load(match[0]);

  // ✅ FIX #1: Rewrite hrefs
$('a').each((_, el) => {
  const $el = $(el);
  const href = $el.attr('href');
  if (!href) return;

  // External links (e.g., /books/n/...)
  if (href.startsWith('/books/')) {
    $el.attr('href', `${baseUrl}${href}`);
    $el.attr('target', '_blank');
    $el.attr('rel', 'noopener noreferrer');
  }

  // Internal app links
  else if (href.startsWith('/data/')) {
    $el.removeAttr('target');
    $el.removeAttr('rel');
  }

  // Reference anchors (stay local)
  else if (href.startsWith('#')) {
    $el.attr('href', href);
    $el.removeAttr('target');
    $el.removeAttr('rel');
  }
});
// ✅ Rewrite <img src="/..."> to full URL
$('img').each((_, el) => {
  const $el = $(el);
  const src = $el.attr('src');
  if (src && src.startsWith('/')) {
    $el.attr('src', `${baseUrl}${src}`);
  }
});

  // ✅ FIX #2: Prevent double wrapping <html><head><body>

const cleanedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            serif: ['Merriweather', 'Georgia', 'serif'],
          },
          colors: {
            heading: '#7b4f24', // brownish
            text: '#1e293b',
          }
        }
      }
    };
  </script>
  <style>
    html {
      transition: background-color 0.3s, color 0.3s;
    }
    ::selection {
      background-color: #93c5fd;
      color: #1e3a8a;
    }
    body {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body class="bg-white dark:bg-slate-900 text-text dark:text-gray-100 font-serif antialiased">

  <!-- ✅ Elegant Navbar -->
  <header class="bg-slate-800 text-white shadow sticky top-0 z-50">
    <div class="max-w-4xl mx-auto flex justify-between items-center px-6 py-3">
      <div class="flex items-center gap-3">
        <img src="/assets/favicon.webp" alt="logo" class="w-8 h-8" />
        <span class="text-xl sm:text-2xl font-semibold tracking-tight">StatPearls</span>
      </div>
      <div class="flex items-center gap-4 text-sky-300 text-sm sm:text-base">
        <a href="/" class="hover:underline">Home</a>
        <button
          id="toggle-theme"
          class="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded shadow transition flex items-center gap-1 text-sm"
        >
          <span id="theme-icon">🌙</span>
          Theme
        </button>
      </div>
    </div>
  </header>

  <!-- ✅ Main Article -->
  <main class="px-4 sm:px-6 py-10 max-w-3xl mx-auto">
    <article class="prose prose-lg dark:prose-invert max-w-3xl mx-auto
      prose-headings:text-[#7b4f24] dark:prose-headings:text-amber-400
      prose-a:text-blue-700 dark:prose-a:text-cyan-400
      prose-strong:text-[#444] dark:prose-strong:text-gray-100
      prose-code:bg-gray-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:rounded
      prose-img:rounded-xl prose-img:shadow-sm
    ">
      ${$('body').html() || $.html()}
    </article>
  </main>

  <!-- ✅ Theme Toggle Script -->
  <script>
    const root = document.documentElement;
    const toggle = document.getElementById('toggle-theme');
    const icon = document.getElementById('theme-icon');

    function applyTheme(mode) {
      if (mode === 'dark') {
        root.classList.add('dark');
        localStorage.theme = 'dark';
        icon.textContent = '🌙';
      } else {
        root.classList.remove('dark');
        localStorage.theme = 'light';
        icon.textContent = '🌞';
      }
    }

    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) applyTheme('dark');
    else applyTheme('light');

    toggle.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  </script>
</body>
</html>
`.trim();

  fs.writeFileSync(htmlPath, cleanedHtml);
  console.log(`✅ Cleaned, fixed links, and saved: ${htmlPath}`);
} catch (err) {
  console.error(`❌ Error during fetch or clean:`, err.message);
}

