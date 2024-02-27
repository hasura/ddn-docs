import { readFileSync } from 'fs';
import { JSONSchema } from './entities/types';
import { generateMarkdown, writeMarkdownToFile } from './logic';

async function main() {
  try {
    console.log(process.cwd());
    const schema: JSONSchema = JSON.parse(
      readFileSync('../../schema_examples/supergraph_or_subgraph_object.schemajson', 'utf8')
    ) as JSONSchema;
    const markdown = generateMarkdown(schema);
    writeMarkdownToFile(markdown);
  } catch (error) {
    console.error('Error generating markdown:', error);
  }
}

main();
