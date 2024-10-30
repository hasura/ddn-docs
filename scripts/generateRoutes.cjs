const fs = require('fs');
const path = require('path');

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

const routesObject = buildRoutesObject(data.docsSidebars.docsSidebar);

// Format the object as a TypeScript constant
const tsOutput = `const docsLinks = ${JSON.stringify(routesObject, null, 2)} as const;\n\nexport default docsLinks;`;

// Write to a .ts file
fs.writeFileSync('./docsLinks.ts', tsOutput);
console.log('docsLinks.ts file created successfully.');
