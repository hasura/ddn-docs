import { readFileSync, writeFileSync } from 'fs';
import { JSONSchema7, topLevelSubgraphObjects } from './entities';
import { returnMarkdown } from './logic/walker';
import { handleSchemaDefinition, updateMarkdown } from './logic';

const schema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

async function main() {
  const description = returnMarkdown(schema.anyOf[0]);
}

main();
