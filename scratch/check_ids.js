const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// Find all ids in HTML
const htmlIds = new Set();
const idRegex = /id="([^"]+)"/g;
let match;
while ((match = idRegex.exec(htmlContent)) !== null) {
  htmlIds.add(match[1]);
}

// Find all getElementById in JS
const jsIds = new Set();
const getElementRegex = /getElementById\("([^"]+)"\)/g;
while ((match = getElementRegex.exec(jsContent)) !== null) {
  jsIds.add(match[1]);
}

console.log(`Found ${htmlIds.size} IDs in HTML`);
console.log(`Found ${jsIds.size} IDs in JS`);

console.log("\nIDs used in JS but missing in HTML:");
let missingCount = 0;
for (const id of jsIds) {
  if (!htmlIds.has(id)) {
    console.log(`- ${id}`);
    missingCount++;
  }
}
if (missingCount === 0) {
  console.log("None! All IDs matched.");
}
