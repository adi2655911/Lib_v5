# #!/bin/bash

# file="$1"
# if [ -z "$file" ]; then
#   echo "❌ Usage: $0 <html_file>"
#   exit 1
# fi

# if [ ! -f "$file" ]; then
#   echo "❌ File not found: $file"
#   exit 1
# fi

# base=$(basename "$file" .html)
# output="${base^}.clean.html"

# # Flatten file into a single line with spaces (to make multiline grep easier)
# html=$(tr '\n' ' ' < "$file")

# # Extract everything from <div class="main-content lit-style" ...> to the closing </dl> after <h2>References</h2>
# content=$(echo "$html" | grep -Pzo '(?s)<div class="main-content lit-style".*?<h2[^>]*>References</h2>.*?<dl.*?>.*?</dl>')

# if [ -z "$content" ]; then
#   echo "❌ Could not find main content and References section in $file"
#   exit 1
# fi

# # Output clean html with some basic styling
# cat <<EOF > "$output"
# <!DOCTYPE html>
# <html>
# <head>
#   <meta charset="utf-8" />
#   <style>
#     body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
#     h1, h2, h3 { color: #003366; }
#     img { max-width: 100%; height: auto; }
#   </style>
# </head>
# <body>
# $content
# </body>
# </html>
# EOF

# echo "✅ Extracted section saved to: $output"

#!/bin/bash

file="$1"
if [ -z "$file" ]; then
  echo "❌ Usage: $0 <html_file>"
  exit 1
fi

if [ ! -f "$file" ]; then
  echo "❌ File not found: $file"
  exit 1
fi

# Flatten the file to single line for multiline regex matching
html=$(tr '\n' ' ' < "$file")

# Extract from <div class="main-content lit-style"> to <h2>References</h2> and the following <dl>
content=$(echo "$html" | grep -Pzo '(?s)<div class="main-content lit-style".*?<h2[^>]*>References</h2>.*?<dl.*?>.*?</dl>')

if [ -z "$content" ]; then
  echo "❌ Could not find main content and References section in $file"
  exit 1
fi

# Overwrite original file with cleaned content and basic HTML structure
cat <<EOF > "$file"
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
$content
</body>
</html>
EOF

echo "✅ Original file overwritten with extracted content: $file"