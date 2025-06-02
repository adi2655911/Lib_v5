#!/data/data/com.termux/files/usr/bin/bash
echo "📥 Fetching latest HTML..."
curl -sL 'https://www.ncbi.nlm.nih.gov/books/NBK430685/' -o index.html

if [ -f index.html ]; then
  echo "✅ index.html saved. Now generating subjects.bson..."
  node scripts/generate-subjects.js
else
  echo "❌ Failed to download index.html"
  exit 1
fi