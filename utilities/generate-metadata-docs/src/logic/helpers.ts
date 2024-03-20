import { readFileSync, writeFileSync } from 'fs';

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
