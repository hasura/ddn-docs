import { writeFileSync } from 'fs';
import { JSONSchema, Definition } from '../entities/types';
import jsYaml from 'js-yaml';

// Utility function to generate markdown links from $ref
export function refToLink(ref: string): string {
  const definitionName = ref.split('/').pop();
  if (!definitionName) return '';
  return `[${definitionName}](#${definitionName.toLowerCase().replace(/ /g, '-')})`;
}

export function generateMarkdown(schema: JSONSchema): string {
  let markdown = `---\nsidebar_position: 100\ntoc_max_heading_level: 2\n---\n# Hasura DDN Metadata Reference\n\nBelow, you can find information for the different definitions used in the Hasura DDN schema.\n\n`;

  const processDefinition = (definition: Definition, key: string): string => {
    let md = `## ${key}\n`;
    if (definition.description) {
      md += `**Description:** ${definition.description}\n\n`;
    }
    if (definition.properties) {
      md += `**Properties:**\n`;
      md += '| Property | Type | Description |\n| --- | --- | --- |\n';
      for (const [propKey, propValue] of Object.entries(definition.properties)) {
        let type = propValue.type;
        // Convert $ref to a link if present
        if (propValue.$ref) {
          type = refToLink(propValue.$ref);
        }
        md += `| **${propKey}** | ${type ? type : `N/A`} | ${propValue.description || 'N/A'} |\n`;
      }
    }
    if (definition.examples) {
      definition.examples.forEach(example => {
        let yamlExample = jsYaml.dump(example);
        md += `\n**Example:**\n\`\`\`yaml\n${yamlExample}\n\`\`\`\n`;
      });
    }
    return md + '\n';
  };

  for (const [key, definition] of Object.entries(schema.definitions)) {
    markdown += processDefinition(definition, key);
  }

  return markdown;
}

export function writeMarkdownToFile(
  markdown: string,
  filename: string = '../../docs/supergraph-modeling/metadata-reference.mdx'
) {
  writeFileSync(filename, markdown);
  console.log(`Markdown documentation written to ${filename}`);
}
