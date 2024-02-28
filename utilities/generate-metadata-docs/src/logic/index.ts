import { writeFileSync } from 'fs';
import { JSONSchema7 } from '../entities/types';
import { generateMarkdownForDefinition, refToLink } from './utilities';

// Function to get a schema and any available oneOf, allOf, or anyOf options (which is a subset of schemas)
function getSchemaWithOptions(schema: JSONSchema7, definitionName?: string): string {
  let md = '';

  // get the title of the object
  const objectTitle = `## ${schema.title}\n`;
  md += objectTitle;

  // get the description
  if (schema.description) {
    const description = `${schema.description}`;
    md += description;
  }

  // get the properties
  if (schema.properties) {
    const properties = `${schema.properties}`;
    md += properties;
  }

  // get the additional properties
  if (schema.additionalProperties) {
    const additionalProperties = `${schema.additionalProperties}`;
    md += additionalProperties;
  }

  // get the possible enums
  if (schema.enum) {
    const enums = `${schema.enum}`;
    md += enums;
  }

  // get the examples
  if (schema.examples) {
    const examples = `${schema.examples}`;
    md += examples;
  }

  // check to see if it's anyOf, allOf, or oneOf and return the options if they are
  if (schema.anyOf) {
    const optionArray = schema.anyOf;
    md += `<div><pre><code>${optionArray
      .map((option, idx) => {
        if (typeof option === 'object' && option.$ref) {
          let ref = refToLink(option.$ref);
          return idx + 1 === optionArray.length ? ref : `${ref} | `;
        }
        return '';
      })
      .join('')}</code></pre></div>`;
  }

  return md;
}

export function generateMarkdown(schema: JSONSchema7): string {
  let md = `---\nsidebar_position: 100\ntoc_max_heading_level: 4\n---\n# Hasura DDN Metadata Reference\n\nBelow, you can find information for the different definitions used in the Hasura DDN schema.\n\n`;

  // Top-level object(s)
  const topLevelSchema = getSchemaWithOptions(schema);
  md += topLevelSchema;

  // Definitions
  if (schema.definitions) {
    const definitions = generateMarkdownForDefinition(schema);
    md += definitions;
  }

  return md;
}

export function writeMarkdownToFile(
  markdown: string,
  filename: string = '../../docs/supergraph-modeling/metadata-reference.mdx'
) {
  writeFileSync(filename, markdown);
  console.log(`Markdown documentation written to ${filename}`);
}
