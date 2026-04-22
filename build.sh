#!/bin/bash
# Build script for minifying assets

echo "Minifying CSS..."
npx cleancss style.css -o style.min.css

echo "Minifying JavaScript..."
terser script.js -o script.min.js --compress --mangle

echo "Build complete!"
echo "Original sizes:"
ls -lh style.css script.js
echo "Minified sizes:"
ls -lh style.min.css script.min.js