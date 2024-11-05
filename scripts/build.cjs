// Find the docs JSON file
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const rootDir = path.join(__dirname, '..');

function copyJsonSchema() {
  // copy the JSON schema file to the root of the project
  const docsDir = path.join(__dirname, '../.docusaurus/docusaurus-plugin-content-docs/default/p');

  const docsFile = fs.readdirSync(docsDir).find(file => file.startsWith('docs') && file.endsWith('.json'));

  if (!docsFile) {
    throw new Error('Could not find the docs JSON file');
  }

  // copy the docs file to the root of the project
  // rename the file to docs-schema.json
  fs.copyFileSync(path.join(docsDir, docsFile), path.join(__dirname, '../docs-schema.json'));
}

// execute the docusaurus build:
execSync(`docusaurus build`, { cwd: rootDir, stdio: 'inherit' });

try {
  copyJsonSchema();
  console.log('\nSuccessfully copied the docs JSON schema file to project root!\n');
} catch (e) {
  console.error(e);
}
