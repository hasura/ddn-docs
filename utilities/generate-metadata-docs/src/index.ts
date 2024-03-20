import { readFileSync, writeFileSync } from 'fs';
import { JSONSchema7, topLevelSubgraphObjects } from './entities';
import { returnMarkdown } from './logic';

const schema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

async function main() {
  // generate markdown for SupergraphOrSubgraphObject
  const markdown = returnMarkdown(schema.anyOf[0]);

  console.log(markdown);
}

main();
