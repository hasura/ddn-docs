const fs = require('fs');
const path = require('path');

// Path to your JSON file
const filePath = path.join(__dirname, '../.docusaurus/docusaurus-plugin-content-docs/default/p/docs-3-0-442.json');
const metadata = require(filePath);

const data = metadata.version;

function buildRoutesObject(arr) {
  const result = {};

  arr.forEach(item => {
    if (item.type === 'link') {
      result[item.label] = item.href;
    } else if (item.type === 'category') {
      result[item.label] = buildRoutesObject(item.items);
    }
  });

  return result;
}

// Usage
const routesObject = buildRoutesObject(data.docsSidebars.docsSidebar);

// Save the structured sidebar as JSON
fs.writeFileSync('./routes.json', JSON.stringify(routesObject, null, 2));
console.log('Routes JSON generated at build/routes.json');
