import $RefParser from '@apidevtools/json-schema-ref-parser';
import { readFileSync } from 'fs';
import { JSONSchema7, topLevelSubgraphObjects, topLevelSupergraphObjects, openDdObjects } from './entities';
import { getMetadataObject, updateMarkdown, walkSchemaToMarkdown } from './logic';

const schema: JSONSchema7 = JSON.parse(
  // readFileSync('../../schema_examples/supergraph_or_subgraph_object.schemajson', 'utf8')
  readFileSync('./schema.json', 'utf8')
);

async function main() {
  try {
    // This is the form $RefParser package to turn our refs into "complete" JSON
    let parsedSchema = await $RefParser.dereference(schema);
    // Then we'll isolate our subgraph types
    let subgraphTypes = (parsedSchema.definitions?.SubgraphObject as any).anyOf?.[0]?.oneOf;
    // And our supergraph types
    let supergraphTypes = (parsedSchema.definitions?.SupergraphObject as any).anyOf?.[0]?.oneOf;
    // And our openDD types
    let OpenDdSupergraphTypes = (parsedSchema.definitions?.OpenDdSupergraphObject as any)?.oneOf;

    // Now we can loop over all the subgraph objects we need
    Object.entries(topLevelSubgraphObjects).forEach(([key, value]) => {
      console.log(`\n🧻 Generating metadata markdown for ${key}`);
      const neededObjects = value;
      let newPageContent = ``;
      neededObjects.map((metadataObject: any) => {
        let singleMetadataObject = getMetadataObject(subgraphTypes, metadataObject);
        if (singleMetadataObject) {
          let result = walkSchemaToMarkdown(singleMetadataObject);
          newPageContent += result;
        }
        updateMarkdown(`../../docs/supergraph-modeling/${key}`, newPageContent);
      });
    });

    // And then do it again for the supergraph objects
    Object.entries(topLevelSupergraphObjects).forEach(([key, value]) => {
      console.log(`\n🧻 Generating metadata markdown for ${key}`);
      const neededObjects = value;
      neededObjects.map((metadataObject: any) => {
        let newMetadataContent = ``;
        let singleMetadataObject = getMetadataObject(supergraphTypes, metadataObject);
        if (singleMetadataObject) {
          let result = walkSchemaToMarkdown(singleMetadataObject);
          newMetadataContent += result;
        }
        updateMarkdown(`../../docs/supergraph-modeling/${key}`, newMetadataContent);
      });
    });

    // Apparently OpenDD is a thing, too 🤷‍♂️
    Object.entries(openDdObjects).forEach(([key, value]) => {
      console.log(`\n🧻 Generating metadata markdown for ${key}`);
      const neededObjects = value;
      neededObjects.map((metadataObject: any) => {
        let newMetadataContent = ``;
        let singleMetadataObject = getMetadataObject(OpenDdSupergraphTypes, metadataObject);
        if (singleMetadataObject) {
          let result = walkSchemaToMarkdown(singleMetadataObject);
          newMetadataContent += result;
        }
        updateMarkdown(`../../docs/supergraph-modeling/${key}`, newMetadataContent);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

main();
