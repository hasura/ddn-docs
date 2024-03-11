import { readFileSync, writeFileSync } from 'fs';
import { JSONSchema7, topLevelSubgraphObjects, topLevelSupergraphObjects, openDdObjects } from './entities';
import { handleSchemaDefinition, updateMarkdown } from './logic';

const schema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

async function main() {
  const subgraphObjects = schema.definitions['OpenDdSubgraphObject'].oneOf;
  // Process the subgraph objects
  for (const [metadataKey, metadataObject] of Object.entries(subgraphObjects)) {
    const definition = handleSchemaDefinition(metadataObject);
    // console.log(definition);
  }
}

main();
