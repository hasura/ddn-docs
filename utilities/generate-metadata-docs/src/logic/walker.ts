import { removeNewLineCharacter, isV1Content } from './helpers';
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
  const heading = depth === 0 ? '###' : '####';

  // Base case: Object is a terminal type or a reference
  if (object.type && object.type !== 'object' && object.type !== 'array') {
    return '';
  }
  if (object['$ref']) {
    return `Reference to [${object['$ref']}](#${object['$ref'].replace('#/definitions/', '')})\n`;
  }

  // Grab the object with title and description
  if (object.title && !isV1Content(object)) {
    markdown += `${heading} ${object.title}\n\n`;
    if (object.description && !isV1Content(object)) {
      markdown += `${object.description}\n\n`;
    }
  }

  // Deal with the object if it has properties
  if (object.properties) {
    const keys = Object.keys(object.properties);
    // This avoids the redundancy of instances like Model and ModelV1
    if (!keys.includes('kind') || !keys.includes('version') || !keys.includes('definition')) {
      markdown += `| Name | Type | Required | Description |\n| ---- | ---- | -------- | ----------- |\n`;

      for (const [key, prop] of Object.entries(object.properties)) {
        const specialCases = ['allOf', 'anyOf'];
        const propName = key;
        let propType = '';
        if ((prop as any).items) {
          if ((prop as any)['items']?.title) {
            propType = `[\`${(prop as any)['items']?.title}\`](#${(prop as any)['items']?.title.toLowerCase()})`;
          }
        } else if ((prop as any).additionalProperties && (prop as any)['additionalProperties'].title) {
          propType = `[\`${(prop as any)['additionalProperties']?.title}\`](#${(prop as any)[
            'additionalProperties'
          ]?.title.toLowerCase()})`;
        } else if ((prop as any).type) {
          propType = `\`${(prop as any).type}\``;
        } else {
          specialCases.forEach(key => {
            if ((prop as any)[key]) {
              if ((prop as any)[key][0].title && (prop as any)[key][0].title != 'Type') {
                propType = `[\`${(prop as any)[key][0].title}\`](#${(prop as any)[key][0].title.toLowerCase()})`;
              } else {
                propType = `\`${(prop as any)[key][0].type}\``;
              }
            }
          });
        }
        const required = object.required?.includes(key) ? 'true' : 'false';
        const description = (prop as any).description || '';
        markdown += `| \`${propName}\` | ${propType} | \`${required}\` | ${removeNewLineCharacter(description)} |\n`;
      }
      markdown += `\n`;
    }
  }

  // Add examples if they exist
  if (object.examples) {
    markdown += `\n\nExample:\n\n`;
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
      if (object['oneOf']) {
        const keys = Object.keys(object['oneOf']);
        // This avoids the redundancy of instances like Model and ModelV1
        // if (!keys.includes('kind') || !keys.includes('version') || !keys.includes('definition')) {
        // }
      }
      object[key].forEach((item: any, index: number) => {
        if (object[key]) markdown += walkSchemaToMarkdown(item, path.concat(`oneOf[${index}]`), depth + 1, visitedRefs);
      });
    }
  });

  return markdown;
}
