import { readFileSync, writeFileSync } from 'fs';
import { JSONSchema7, topLevelSubgraphObjects, topLevelSupergraphObjects, openDdObjects } from './entities';
import { generateMarkdownForTopLevelMetadataKind, updateMarkdown } from './logic';

const schema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

async function main() {
  // TODO: Right now, just testing with subgraph objects
  const subgraphObjects = schema.definitions['OpenDdSubgraphObject'].oneOf;
  const supergraphObjects = schema.definitions['HasuraSupergraphObject'].oneOf;
  const openSupergraphObjects = schema.definitions['OpenDdSupergraphObject'].oneOf;

  // Process the subgraph objects
  for (const [metadataKey, metadataObject] of Object.entries(subgraphObjects)) {
    console.log(`Processing ${metadataObject.title}`);
    const markdown = generateMarkdownForTopLevelMetadataKind(metadataObject);
    if (markdown) {
      // TODO: Rewrite the updateMarkdown function to write this to the docs files
      writeFileSync(`./md_samples/${metadataObject.title}.mdx`, markdown);
      for (const [key, value] of Object.entries(topLevelSubgraphObjects)) {
        value.forEach((metadataObjectName, idx) => {
          if (metadataObjectName === metadataObject.title) {
            if (idx === 0) {
              console.log(`${metadataObject.title} is first on the page`);
            } else {
              console.log(`${metadataObject.title} follows others`);
            }
          }
        });
      }
    }
  }

  // Process the supergraphObjects
  for (const [metadataKey, metadataObject] of Object.entries(supergraphObjects)) {
    console.log(`Processing ${metadataObject.title}`);
    const markdown = generateMarkdownForTopLevelMetadataKind(metadataObject);
    if (markdown) {
      // TODO: Rewrite the updateMarkdown function to write this to the docs files
      writeFileSync(`./md_samples/${metadataObject.title}.mdx`, markdown);
    }
  }

  // Process the openDd supergraphObjects
  for (const [metadataKey, metadataObject] of Object.entries(openSupergraphObjects)) {
    console.log(`Processing ${metadataObject.title}`);
    const markdown = generateMarkdownForTopLevelMetadataKind(metadataObject);
    if (markdown) {
      // TODO: Rewrite the updateMarkdown function to write this to the docs files
      writeFileSync(`./md_samples/${metadataObject.title}.mdx`, markdown);
    }
  }
}

main();
