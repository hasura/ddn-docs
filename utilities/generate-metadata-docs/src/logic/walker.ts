import { removeCarriageReturn, isV1Content } from './helpers';
import jsYaml from 'js-yaml';

export function walkSchemaToMarkdown(
  object: any,
  path: string[] = [],
  depth: number = 0,
  visitedRefs = new Set<string>(),
  currentPath = ''
): string {
  // Construct a unique identifier for the current object
  let uniqueId = object['$id'] || object.title || path.join('.');
  if (visitedRefs.has(uniqueId)) {
    return '';
  }
  visitedRefs.add(uniqueId);

  const newPath = currentPath + '.' + path.join('.');
  if (visitedRefs.has(newPath)) {
    return '';
  }
  visitedRefs.add(newPath);

  let markdown = '';
  const indent = '    '.repeat(depth);
  const heading = depth === 0 ? '###' : '####';

  // Base case: Object is a terminal type or a reference
  if (object.type && object.type !== 'object' && object.type !== 'array') {
    return '';
  }
  if (object['$ref']) {
    return `${indent}- Reference to [${object['$ref']}](#${object['$ref'].replace('#/definitions/', '')})\n`;
  }

  // Grab the object with title and description
  if (object.title && !isV1Content(object)) {
    markdown += `${heading} ${object.title}\n\n`;
    if (object.description && !isV1Content(object)) {
      markdown += `${object.description}\n\n`;
    }
  }

  // Deal with the object if it has properties
  if (object.properties && Object.keys(object.properties).length > 0) {
    const keys = Object.keys(object.properties);
    if (keys.length !== 3 || !keys.includes('kind') || !keys.includes('version') || !keys.includes('definition')) {
      markdown += `| Name | Type | Required | Description |\n| ---- | ---- | -------- | ----------- |\n`;

      for (const [key, prop] of Object.entries(object.properties)) {
        const propName = key;
        const propType = (prop as any).type
          ? (prop as any).type
          : (prop as any)['$ref']
          ? `[${(prop as any)['$ref'].split('/').pop()}](#${(prop as any)['$ref'].split('/').pop()})`
          : 'object';
        const required = object.required?.includes(key) ? 'true' : 'false';
        const description = (prop as any).description || '';
        markdown += `| \`${propName}\` | ${propType} | ${required} | ${removeCarriageReturn(description)} |\n`;
      }
      markdown += `\n`;
    }
  }

  // Add examples if they exist
  if (object.examples && object.examples.length > 0) {
    markdown += `Example:\n\n`;
    object.examples.forEach((example: any) => {
      markdown += `\`\`\`yaml\n${jsYaml.dump(example)}\n\`\`\`\n`;
    });
    markdown += `\n`;
  }

  // Recursive case: deal with nested objects, arrays, and oneOf/anyOf/allOf
  if (object.properties) {
    for (const [key, prop] of Object.entries(object.properties)) {
      markdown += walkSchemaToMarkdown(prop, path.concat(key), depth + 1, visitedRefs);
    }
  }

  if (object.type === 'array' && object.items) {
    markdown += walkSchemaToMarkdown(object.items, path.concat('[]'), depth + 1, visitedRefs);
  }

  ['oneOf', 'anyOf', 'allOf'].forEach(key => {
    if (object[key]) {
      object[key].forEach((item: any, index: number) => {
        markdown += walkSchemaToMarkdown(item, path.concat(`oneOf[${index}]`), depth + 1, visitedRefs);
      });
    }
  });

  return markdown;
}
