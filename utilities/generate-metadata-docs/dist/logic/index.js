"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeMarkdownToFile = exports.generateMarkdown = exports.refToLink = void 0;
const fs_1 = require("fs");
const js_yaml_1 = __importDefault(require("js-yaml"));
// Utility function to generate markdown links from $ref
function refToLink(ref) {
    const definitionName = ref.split('/').pop();
    if (!definitionName)
        return '';
    return `[${definitionName}](#${definitionName.toLowerCase().replace(/ /g, '-')})`;
}
exports.refToLink = refToLink;
function generateMarkdown(schema) {
    let markdown = `---\nsidebar_position: 100\ntoc_max_heading_level: 2\n---\n# Hasura DDN Metadata Reference\n\nBelow, you can find information for the different definitions used in the Hasura DDN schema.\n\n`;
    const processDefinition = (definition, key) => {
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
                let yamlExample = js_yaml_1.default.dump(example);
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
exports.generateMarkdown = generateMarkdown;
function writeMarkdownToFile(markdown, filename = '../../docs/supergraph-modeling/metadata-reference.mdx') {
    (0, fs_1.writeFileSync)(filename, markdown);
    console.log(`Markdown documentation written to ${filename}`);
}
exports.writeMarkdownToFile = writeMarkdownToFile;
