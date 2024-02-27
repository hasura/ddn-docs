import { generateMarkdown, refToLink, writeMarkdownToFile } from '../src/logic/index';
import { JSONSchema, Definition } from '../src/entities/types';
import * as fs from 'fs';

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

console.log = jest.fn();

describe('refToLink', () => {
  it('should convert $ref to a markdown link', () => {
    const ref = '#/definitions/MyDefinition';
    expect(refToLink(ref)).toBe('[MyDefinition](#mydefinition)');
  });

  it('should return an empty string if no definition name is found', () => {
    const ref = '#/definitions/';
    expect(refToLink(ref)).toBe('');
  });
});

describe('generateMarkdown', () => {
  it('should generate markdown from a JSON schema', () => {
    const schema: JSONSchema = {
      title: 'My Schema',
      definitions: {
        MyDefinition: {
          title: 'My title',
          type: 'string',
          description: 'This is my definition',
          properties: {
            myProperty: {
              type: 'string',
              description: 'This is my property',
            },
          },
          examples: [
            {
              myProperty: 'example value',
            },
          ],
        },
      },
    };

    const expectedMarkdown = `---
sidebar_position: 100
toc_max_heading_level: 2
---
# Hasura DDN Metadata Reference

Below, you can find information for the different definitions used in the Hasura DDN schema.

## MyDefinition
**Description:** This is my definition

**Properties:**
| Property | Type | Description |
| --- | --- | --- |
| **myProperty** | string | This is my property |

**Example:**
\`\`\`yaml
myProperty: example value

\`\`\`

`;

    const generatedMarkdown = generateMarkdown(schema);

    console.log(generatedMarkdown);

    console.log(expectedMarkdown);

    expect(generatedMarkdown).toBe(expectedMarkdown);
  });
});

describe('writeMarkdownToFile', () => {
  it('should write markdown to a file', () => {
    const markdown = 'This is some markdown';
    const filename = 'test.md';

    writeMarkdownToFile(markdown, filename);

    expect(fs.writeFileSync).toHaveBeenCalledWith(filename, markdown);
    expect(console.log).toHaveBeenCalledWith(`Markdown documentation written to ${filename}`);
  });
});
