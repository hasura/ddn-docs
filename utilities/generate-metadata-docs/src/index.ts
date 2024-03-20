import { readFileSync } from 'fs';
import { JSONSchema7, topLevelSubgraphObjects, topLevelSupergraphObjects } from './entities';
import { returnMarkdown, updateMarkdown } from './logic';

const schema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));
const schemaDefinitions: JSONSchema7 = schema.anyOf[0].definitions;

async function main() {
  // generate markdown for subgraph objects
  for (const [key, value] of Object.entries(topLevelSubgraphObjects)) {
    let pageMarkdown = '';
    const metadataObjects: string[] = value;
    metadataObjects.map(singleObject => {
      pageMarkdown += returnMarkdown(schemaDefinitions[singleObject]);
    });
    updateMarkdown(`./md_samples/${key}`, pageMarkdown);
  }
}

main();
