import { readFileSync, writeFileSync } from 'fs';

/**
 * Wrote this just for testing and to better understand base-case philosophy with recursion.
 */
export function walkSchema(object: any, path: string[] = [], depth: number = 0) {
  const indent = '    '.repeat(depth); // Increase indentation based on depth
  const pathStr = path.join('.');

  // Base case is an object that is a terminal type or a reference
  if (object.type && object.type !== 'object' && object.type !== 'array') {
    console.log(`${indent}🛑   Terminal found at ${pathStr} with type ${object.type}`);
    return;
  }
  if (object['$ref']) {
    console.log(`${indent}Reference found at ${pathStr} with reference ${object['$ref']}`);
    return;
  }

  // Recursive case of object that has properties
  if (object.properties) {
    console.log(`${indent}📂 ${pathStr} (object with properties)`);
    for (const key of Object.keys(object.properties)) {
      walkSchema(object.properties[key], path.concat(key), depth + 1);
    }
  }

  // Recursive case of an array with items
  if (object.type === 'array' && object.items) {
    console.log(`${indent}📄 ${pathStr} (array)`);
    walkSchema(object.items, path.concat('[]'), depth + 1);
  }

  // Recursive case for oneOf, anyOf, allOf
  ['oneOf', 'anyOf', 'allOf'].forEach(key => {
    if (object[key]) {
      console.log(`${indent}📦 ${pathStr} can be unpacked (${key})`);
      object[key].forEach((item: any, index: number) => {
        walkSchema(item, path.concat(`${key}[${index}]`), depth + 1);
      });
    }
  });
}

/**
 * Some descriptions have new-line characters which can cause rendering issues inside of md tables.
 * This helper removes the new-line character and provides a single block of text.
 */
export function removeNewLineCharacter(text: string) {
  return text.replace(/\n/g, ' ');
}

/**
 * To make the metadata structure flow a bit easier, we'll avoid the "duplication" of a metadata object followed by
 * `V1`. As an example, there is a `Command` object and a `CommandV1` object that acts as the definition of that object;
 * as all metadata objects need `kind` and `version` fields, this allows us to front-load the object's definition and skip
 * the "redundancy" of these two fields while also not duplicating content (description of the object).
 */
export function isV1Content(metadataObject: any): boolean {
  if (metadataObject.title?.includes('V1')) {
    return true;
  }
  return false;
}

/**
 * This function allows us to identify and isolate a particular metadata object based on its title.
 * This works for top-level metadata objects (E.g., Model, Command, TypePermissions)
 */
export function getMetadataObject(schemaObject: any, objectTitle: string): object | void {
  const metadataObject = schemaObject.find((option: any) => option.title === objectTitle);
  if (metadataObject) {
    return metadataObject;
  }
}

/**
 * When we write to a file, we need to find any content that appears after ## Metadata structure
 * ☝️ This string is used as our target and we wipe everything on the page after it and replace
 * it with the updated markdown.
 */
export function updateMarkdown(filePath: string, newMetadataMarkdown: string): boolean {
  try {
    const existingContents = readFileSync(filePath, 'utf-8');

    const parts = existingContents.split('## Metadata structure');
    let newContents = parts[0] + '## Metadata structure\n\n' + newMetadataMarkdown;

    writeFileSync(filePath, newContents, 'utf-8');

    console.log(`    ✅ markdown updated for ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to update Markdown: ${error}`);
    return false;
  }
}

/**
 * Checks for whether or not a type is a simple scalar — if it is, we don't need
 * a reference so we return false.
 */
export function isTypeSimpleScalar(objectType: string): boolean {
  const scalars = [`string`, `number`];
  scalars.includes(objectType) && true;
  return false;
}

// For formatting heading tags
export function formatLink(linkText: string): string {
  if (linkText) {
    return linkText.toLowerCase().replace(' ', '-');
  }
}
