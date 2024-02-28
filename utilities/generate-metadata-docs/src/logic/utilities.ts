import { JSONSchema7, JSONSchema7Definition, JSONSchema7Type } from '../entities/types';
import jsYaml from 'js-yaml';

// Utility function to generate markdown links from $ref
export function refToLink(ref: string): string {
  let definitionName = '';
  if (ref != undefined) {
    definitionName = ref.split('/').pop()!;
  }
  if (!definitionName || definitionName === undefined) return `<a href="#">${definitionName}</a>`;
  return `<a href="#${definitionName.toLowerCase().replace(/ /g, '-')}">${definitionName}</a>`;
}

export function generateMarkdownForDefinition(schema: JSONSchema7): string {
  try {
    let md = ``;
    if (schema.definitions) {
      for (const [definitionName, definition] of Object.entries(schema.definitions)) {
        md += `\n## ${definitionName}\n\n`;
        // Check allllllll the things
        if (typeof definition === 'object') {
          if (definition.description) {
            md += `${definition.description}\n\n`;
          }
          if (definition.type) {
            md += `**Type**: \`${definition.type}\`\n\n`;
          }
          if (definition.properties) {
            md += createPropertiesTable(definition.properties);
          }
          //   TODO: Need to do additional properties if it has them
          if (definition.enum) {
            md += createEnumBlock(definition.enum);
          }
          if (definition.examples) {
            md += generateExample(definition.examples);
          }
          if (definition.anyOf) {
            md += generateAnyOfBlock(definition.anyOf);
          }
          if (definition.oneOf) {
            // This is where things get really recursive
            md += `\n\nCan be achieved using one of the following:\n\n`;
            for (const item of definition.oneOf) {
              if (typeof item === 'object' && !Array.isArray(item)) {
                // Recursively call a function designed to handle individual schema definitions
                md += `- ${item.description}\n`;

                md += generateExample(item.examples);
              }
            }
          }
          if (definition.allOf) {
            md += generateOneOfTable(definition.allOf);
          }
        }
      }
    }
    return md;
  } catch (err) {
    throw Error(`Couldn't find definitions: ${err}`);
  }
}

// We'll use this to create and style tables for properties
function createPropertiesTable(properties: { [key: string]: JSONSchema7Definition }): string {
  let md = `
  | Property | Type | Description |
  |----------|------|-------------|
  `;

  // Iterate over each property in the properties object
  for (const [propertyName, propertyDef] of Object.entries(properties)) {
    let type = '';
    let description = '';

    if (typeof propertyDef === 'object') {
      if (Array.isArray(propertyDef.type)) {
        type = propertyDef.type.join(', ');
      } else if (propertyDef.type) {
        type = propertyDef.type;
      } else {
        type = 'N/A';
      }

      description = propertyDef.description ? propertyDef.description : 'N/A';

      md += `| \`${propertyName}\` | ${type} | ${description} |\n`;
    } else {
      // Handle boolean schemas
      type = 'boolean schema';
      description = propertyDef ? 'Allows any value (true schema)' : 'Disallows any value (false schema)';
      md += `| ${propertyName} | ${type} | ${description} |\n`;
    }
  }

  return md;
}

// TODO: Transform to code blocks instead of tables
// This is for enum blocks? 🤷‍♂️
function createEnumBlock(enums: JSONSchema7Type): string {
  let md = `**Enums**\n\n`;

  if (Array.isArray(enums)) {
    md += `| Value |\n|-------|\n`;
    for (const value of enums) {
      md += `| ${value} |\n`;
    }
  }

  return md;
}

// To generate examples as yaml
function generateExample(example: any): string {
  let md = `\n\n**Example:**\n\n`;

  const exampleAsYaml = jsYaml.dump(example);

  md += `\`\`\`yaml${exampleAsYaml}\`\`\``;

  return md;
}

// Deal with them anyOfs
function generateAnyOfBlock(definition: JSONSchema7Definition[]) {
  let md = ``;
  if (definition) {
    md += `<div><pre><code>${definition
      .map((option, idx) => {
        if (typeof option === 'object' && option.$ref) {
          let ref = refToLink(option.$ref);
          return idx + 1 === definition.length ? ref : `${ref} | `;
        }
        return '';
      })
      .join('')}</code></pre></div>`;
  }

  return md;
}

// Then those oneOfs
function generateOneOfTable(definition: JSONSchema7Definition[]) {
  let md = ``;
  if (definition) {
    md += `<div><pre><code>${definition
      .map((option, idx) => {
        if (typeof option === 'object' && option.$ref) {
          let ref = refToLink(option.$ref);
          return idx + 1 === definition.length ? ref : `${ref} | `;
        }
        return '';
      })
      .join('')}</code></pre></div>`;
  }

  return md;
}

// Finally, those allOfs
function generateAllOfBlock(definition: JSONSchema7Definition[]) {
  let md = ``;
  if (definition) {
    md += `<div><pre><code>${definition
      .map((option, idx) => {
        if (typeof option === 'object' && option.$ref) {
          let ref = refToLink(option.$ref);
          return idx + 1 === definition.length ? ref : `${ref} | `;
        }
        return '';
      })
      .join('')}</code></pre></div>`;
  }

  return md;
}
