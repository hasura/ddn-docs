// Find the docs JSON file
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const rootDir = path.join(__dirname, '..');

function copyJsonSchema() {
  console.log('\n\x1b[32mTrying to copy the docs JSON schema file to project root for the console...\x1b[0m');
  const docsDir = path.join(__dirname, '../.docusaurus/docusaurus-plugin-content-docs/default/p');

  // Check if docs directory exists first
  if (!fs.existsSync(docsDir)) {
    throw new Error(`Docs directory not found: ${docsDir}`);
  }

  const docsFile = fs.readdirSync(docsDir).find(file => file.startsWith('docs') && file.endsWith('.json'));

  if (!docsFile) {
    throw new Error('Could not find the docs JSON file');
  }

  const sourcePath = path.join(docsDir, docsFile);
  const targetPath = path.join(__dirname, '../docs-schema.json');

  fs.copyFileSync(sourcePath, targetPath);
}

execSync(`docusaurus build`, { cwd: rootDir, stdio: 'inherit' });

try {
  copyJsonSchema();
  console.log('\x1b[32m\nSuccessfully copied the docs JSON schema file to project root!\n\x1b[0m');
} catch (e) {
  console.error('Build failed:', e.message);
  process.exit(1); // Exit with error code
}
