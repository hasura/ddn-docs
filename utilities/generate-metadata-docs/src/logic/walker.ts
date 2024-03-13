import { readFileSync } from 'fs';
import { JSONSchema7, JSONSchema7Definition } from '../entities';
import jsYaml from 'js-yaml';

const parentSchema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

let markdownArray: string[] = [];

let visitedRefs = {};

function getType(metadata: JSONSchema7Definition): string | void {
  if (metadata.type) {
    if (Array.isArray(metadata.type)) {
      return metadata.type[0];
    } else {
      return metadata.type;
    }
  }
}

function getParsedRef(ref: string) {
  return ref?.split('/')?.pop()
}

function handleRef(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
  const ref = metadataObject.$ref;
  const parsedRef = getParsedRef(ref);
  const referencedObject = parentSchema.anyOf[0].definitions[parsedRef];
  if (referencedObject != undefined) {
    return { ...metadataObject, ...referencedObject };
  } else {
    console.warn(`This is a non-local definition: ${ref}`);
  }
}

export function returnMarkdown(metadataObject: JSONSchema7): string[] {
  handleSchemaDefinition(metadataObject);

  return markdownArray;
}

export function handleSchemaDefinition(metadataObject: JSONSchema7Definition): string {
  metadataObject = simplifyMetadataDefinition(metadataObject);

  if (metadataObject.$ref) {
    metadataObject = handleRef(metadataObject);
  }

  if (!metadataObject) {
    return;
  }

  let typeDefinition = ``;

  const refTitle = metadataObject.title || getParsedRef(metadataObject.$ref);

  if (refTitle && Object.keys(visitedRefs).includes(refTitle)) {
    // return visitedRefs[metadataObject.title || metadataObject.$ref];
    return visitedRefs[refTitle];
  }

  if (refTitle) {
    //hack: add to visited refs early to avoid infinite loops. the actual value is set at the end of the fn.
    visitedRefs[refTitle] = refTitle;
  }

  const type = getType(metadataObject);

  // Deal with const
  if (metadataObject.const) {
    typeDefinition = handleConst(metadataObject);
  }

  // Deal with enum
  if (metadataObject.enum) {
    typeDefinition = handleEnum(metadataObject);
  }

  const scalarTypes = [`string`, `number`, `integer`, `null`, `boolean`];
  if (type && scalarTypes.includes(type)) {
    typeDefinition = handleScalars(metadataObject);
  }

  // Deal with items
  if (type === 'array') {
    typeDefinition = handleArrayType(metadataObject);
  }

  // Deal with oneOf
  if (metadataObject.oneOf) {
    typeDefinition = handleOneOf(metadataObject);
  }

  // Deal with allOfs
  if (metadataObject.allOf) {
    typeDefinition = handleAllOf(metadataObject);
  }

  // Deal with anyOfs
  if (metadataObject.anyOf) {
    typeDefinition = handleAnyOf(metadataObject);
  }

  // Deal with additionalProperties
  if (metadataObject.additionalProperties && type === 'object') {
    typeDefinition = handleAdditionalProperties(metadataObject);
  }

  // Deal with properties
  if (metadataObject.properties && type === 'object') {
    typeDefinition = handleProperties(metadataObject);
  }

  if (refTitle) {
    // set visited ref to typeDefinition
    visitedRefs[refTitle] = typeDefinition;
  }

  return typeDefinition;
}

/**
 * Everything from this to the next comment is for handling cases encountered when navigating
 * a JSONSchema7Definition.
 */
function handleConst(metadataObject: JSONSchema7Definition) {
  if (metadataObject.const) {
    return metadataObject.const.toString();
  }
}

function handleEnum(metadataObject: JSONSchema7Definition) {
  if (metadataObject.enum) {
    return metadataObject.enum.join(' | ');
  }
}

function handleScalars(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  const scalarTypes = [`string`, `number`, `integer`, `null`, `boolean`];
  if (type && scalarTypes.includes(type)) {
    return type;
  }
}

function simplifyMetadataDefinition(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
  let simplifiedSchema = metadataObject;
  if (metadataObject?.allOf?.length === 1) {
    const { allOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = simplifyMetadataDefinition(allOf[0]);
    simplifiedSchema = {
      ...strippedSchema,
      ...simplifiedSchema,
    };
  } else if (metadataObject?.oneOf?.length === 1) {
    const { oneOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = simplifyMetadataDefinition(oneOf[0]);
    simplifiedSchema = {
      ...strippedSchema,
      ...simplifiedSchema,
    };
  } else if (metadataObject?.anyOf?.length === 1) {
    const { anyOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = simplifyMetadataDefinition(anyOf[0]);
    simplifiedSchema = {
      ...strippedSchema,
      ...simplifiedSchema,
    };
  }
  return simplifiedSchema;
}

function handleProperties(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.type && metadataObject.type === 'object') {
    let markdown = '';
    markdown += `\n### ${metadataObject.title || getParsedRef(metadataObject.$ref)}\n\n`;
    if (metadataObject.description)
      markdown += `${metadataObject.description }\n\n`
    markdown += `\n| Name | Type | Required | Description |\n|-----|-----|-----|-----|\n`;
    for (const [propertyKey, propertySchema] of Object.entries(metadataObject.properties)) {
      const propertyType = handleSchemaDefinition(propertySchema);
      const requiredProp =  (metadataObject.required && metadataObject.required.includes(propertyKey));
      markdown += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${propertySchema.description || ''} |\n`;
    }
    markdownArray.push(markdown);

    return `[${metadataObject?.title}](#${metadataObject?.title?.toLowerCase()})`;
  }
  return ``;
}

function handleAdditionalProperties(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.type && metadataObject.type === 'object') {
    let markdown = '';
    markdown += `\n### ${metadataObject.title || getParsedRef(metadataObject.$ref)}\n`;
    if (metadataObject.description)
      markdown += `${metadataObject.description }\n`
    markdown += `\n| Name | Type | Required | Description |\n|-----|-----|-----|-----|\n`;
    markdown += `| \`customKey\` | ${handleSchemaDefinition(metadataObject.additionalProperties)} | No | ${
      metadataObject.additionalProperties.description || ''
    } |\n`;
    markdownArray.push(markdown);

    return `[${metadataObject?.title}](#${metadataObject?.title?.toLowerCase()})`;
  }
  return ``;
}

function handleAllOf(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.allOf.map(option => {
    return handleSchemaDefinition(option);
  });
  return objectRefs.join(` \| `);
}

function handleAnyOf(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.anyOf.map(option => {
    return  handleSchemaDefinition(option);
  });
  return objectRefs.join(` \| `);
}

function handleOneOf(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.oneOf.map(option => {
      return handleSchemaDefinition(option);
    });
  return objectRefs.join(` \| `);
}

function handleArrayType(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  if (type === 'array') {
    const itemType = Array.isArray(metadataObject.items) ? metadataObject.items[0] : metadataObject.items;
    return `[${handleSchemaDefinition(itemType)}]`;
  }
}
