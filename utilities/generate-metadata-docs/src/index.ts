import { readFileSync, writeFileSync } from 'fs';
import { JSONSchema7 } from './entities/types';
import { processSchemaToJson } from './logic';

const schema: JSONSchema7 = JSON.parse(
  readFileSync('../../schema_examples/supergraph_or_subgraph_object.schemajson', 'utf8')
);

async function main() {
  try {
    // let's loop over the schema
    let schemaStructure = processSchemaToJson(schema);
    console.log(schemaStructure);
    writeFileSync(`auto-generated.json`, schemaStructure);
    // then let's make some markdown and add it to the appropriate pages 🤙
  } catch (error) {
    console.error('Error generating markdown:', error);
  }
}

main();
