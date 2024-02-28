import { readFileSync } from 'fs';
import { JSONSchema7 } from './entities/types';
import { generateMarkdown, writeMarkdownToFile } from './logic';

async function main() {
  try {
    console.log(process.cwd());
    const schema: JSONSchema7 = JSON.parse(
      readFileSync('../../schema_examples/supergraph_or_subgraph_object.schemajson', 'utf8')
    );
    const markdown = generateMarkdown(schema);
    writeMarkdownToFile(markdown);
  } catch (error) {
    console.error('Error generating markdown:', error);
  }
}

main();
