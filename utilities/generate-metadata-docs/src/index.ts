import { topLevelMetadataObjects } from './entities/objects';
import { generatePageMarkdown } from './logic/helpers';

async function main() {
  // generate markdown for metadata objects
  for (const [fileName, metadataObjectTitles] of Object.entries(topLevelMetadataObjects)) {
    generatePageMarkdown(fileName, metadataObjectTitles);
  }
}

main();
