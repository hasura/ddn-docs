import { readFileSync, writeFileSync } from 'fs';
import { JSONSchema7Definition } from '../entities/types';
import { returnMarkdown } from './walker';
import { parentSchema } from '../entities/objects';

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
export function isV1Content(metadataObject: JSONSchema7Definition): boolean {
  return !!metadataObject.title?.includes('V1');
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

export function generatePageMarkdown(fileName: string, metadataObjectTitles: string[]) {
  let pageMarkdown = '';

  metadataObjectTitles.map(metadataObjectTitle => {
    const metadataObjectSchema = findSchemaDefinitionByTitle(parentSchema, metadataObjectTitle);
    if (metadataObjectSchema) {
      pageMarkdown += returnMarkdown(metadataObjectSchema);
    } else {
      console.warn('Schema not found for: ', metadataObjectTitle);
    }
  });

  updateMarkdown(`../../docs/supergraph-modeling/${fileName}.mdx`, pageMarkdown);
}

/**
 * This function allows us to identify and isolate a particular metadata object based on its title.
 * This works for top-level metadata objects (E.g., Model, Command, TypePermissions)
 * Currently only handles anyOf, allOf, oneOf elements in schemaDefinitions
 */
export function findSchemaDefinitionByTitle(schema: JSONSchema7Definition, objectTitle: string): JSONSchema7Definition {
  if (!schema) {
    return;
  }

  schema = simplifyMetadataDefinition(schema);
  if (schema.$ref) {
    schema = handleRef(schema);
  }

  if (schema.title === objectTitle) {
    return schema;
  }

  for (let potentialSchema of [...(schema.allOf || []), ...(schema.oneOf || []), ...(schema.anyOf || [])]) {
    if (potentialSchema.$ref) {
      potentialSchema = handleRef(potentialSchema);
    }
  }

  if (!schema.type) {
    for (let potentialSchema of [...(schema.allOf || []), ...(schema.oneOf || []), ...(schema.anyOf || [])]) {
      const foundSchema = findSchemaDefinitionByTitle(potentialSchema, objectTitle);
      if (foundSchema) {
        return foundSchema;
      }
    }
  }
}

export function getType(metadataObject: JSONSchema7Definition): string | void {
  if (metadataObject.type) {
    if (Array.isArray(metadataObject.type)) {
      return metadataObject.type[0];
    } else {
      return metadataObject.type;
    }
  }
}

export function getArrayItemType(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
  return Array.isArray(metadataObject.items) ? metadataObject.items[0] : metadataObject.items;
}

export function getTitle(metadataObject: JSONSchema7Definition): string {
  return metadataObject.title || getParsedRef(metadataObject.$ref);
}

export function getDescription(metadataObject: JSONSchema7Definition): string {
  return metadataObject.description ? removeNewLineCharacter(metadataObject.description) : '';
}

// For formatting heading tags
export function formatLink(linkText: string): string {
  if (linkText) {
    return linkText.toLowerCase().replace(' ', '-');
  }
}

export function getRefLink(metadataObject: JSONSchema7Definition): string {
  return `[${getTitle(metadataObject)}](#${formatLink(getTitle(metadataObject))})`;
}

export function getParsedRef(ref: string): string {
  return ref?.split('/')?.pop();
}

export function handleRef(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
  const ref = metadataObject.$ref;

  const { $ref, ...strippedSchema } = metadataObject;

  const refPath = ref?.split('/');
  let refObject = parentSchema;
  refPath.forEach(path => {
    if (path !== '#') {
      refObject = refObject?.[path];
    }
  });

  if (refObject !== undefined) {
    refObject = simplifyMetadataDefinition({ ...refObject, ...strippedSchema });
    if (refObject.$ref) {
      refObject = handleRef(refObject);
    }
    return refObject;
  } else {
    console.warn('Ref not found: ', ref);
  }
}

export function simplifyMetadataDefinition(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
  let simplifiedSchema = metadataObject;
  if (metadataObject?.allOf?.length === 1) {
    const { allOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = {
      ...simplifyMetadataDefinition(allOf[0]),
      ...strippedSchema,
    };
  } else if (metadataObject?.oneOf?.length === 1) {
    const { oneOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = {
      ...simplifyMetadataDefinition(oneOf[0]),
      ...strippedSchema,
    };
  } else if (metadataObject?.anyOf?.length === 1) {
    const { anyOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = {
      ...simplifyMetadataDefinition(anyOf[0]),
      ...strippedSchema,
    };
  }
  return simplifiedSchema;
}

export function isScalarType(metadataObject: JSONSchema7Definition): boolean {
  const type = getType(metadataObject);

  const scalarTypes = [`string`, `number`, `integer`, `null`, `boolean`];

  return type && scalarTypes.includes(type);
}

export function isNullType(metadataObject: JSONSchema7Definition): boolean {
  const type = getType(metadataObject);

  return type === 'null';
}

// Checks if the given metadataObject is a `oneOf` with each variant being discriminated
// by the presence of a particular field and the variant specific fields nested
// within.
export function isExternallyTaggedOneOf(metadataObject: JSONSchema7Definition): boolean {
  if (metadataObject.oneOf) {
    return (
      metadataObject.oneOf.length > 1 &&
      metadataObject.oneOf.every(sub_object => {
        let result =
          sub_object.properties &&
          Object.keys(sub_object.properties).length === 1 &&
          sub_object.required &&
          Object.keys(sub_object.required).length === 1;
        return result;
      })
    );
  } else {
    return false;
  }
}

// Checks if the given object is `anyOf` either null or a metadataObject
export function isExternallyTaggedNullable(metadataObject: JSONSchema7Definition): boolean {
  return (
    metadataObject.anyOf &&
    metadataObject.anyOf.length === 2 &&
    metadataObject.anyOf.some(sub_object => isNullType(sub_object))
  );
}
