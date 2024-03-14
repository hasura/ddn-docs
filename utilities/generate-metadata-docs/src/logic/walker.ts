import { readFileSync } from 'fs';
import { JSONSchema7, JSONSchema7Definition } from '../entities';
import jsYaml from 'js-yaml';

const parentSchema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

let markdownArray: string[] = [];

let visitedRefs = {};

function getType(metadataObject: JSONSchema7Definition): string | void {
  if (metadataObject.type) {
    if (Array.isArray(metadataObject.type)) {
      return metadataObject.type[0];
    } else {
      return metadataObject.type;
    }
  }
}

function getTitle(metadataObject: JSONSchema7Definition): string {
  return metadataObject.title || getParsedRef(metadataObject.$ref);
}

// For formatting heading tags
function formatLink(linkText: string): string {
  if (linkText) {
    return linkText.toLowerCase().replace(' ', '-');
  }
}

function getRefLink(metadataObject: JSONSchema7Definition): string {
  return `[${getTitle(metadataObject)}](#${formatLink(getTitle(metadataObject))})`
}

function getParsedRef(ref: string) {
  return ref?.split('/')?.pop();
}

function handleRef(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
  const ref = metadataObject.$ref;
  const parsedRef = getParsedRef(ref);
  const referencedObject = parentSchema.anyOf[0].definitions[parsedRef];
  if (referencedObject != undefined) {
    return { ...metadataObject, ...referencedObject };
  } else {
    // We have a set of deeply nested refs that aren't at #/anyOf/0/definitions/
    const base = `#/anyOf/0/definitions/VersionedSchemaAndCapabilities/oneOf/0/properties/`;
    const nestedRef = ref.split(base)[1];
    const category = nestedRef.split('/')[0];
    const deeplyNestedObject = nestedRef.split('/').pop();
    const nestedReferencedObject =
      parentSchema.anyOf[0].definitions['VersionedSchemaAndCapabilities'].oneOf[0].properties[category].definitions[
        deeplyNestedObject
      ];
    return { ...metadataObject, ...nestedReferencedObject };
  }
}


function simplifyMetadataDefinition(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
  let simplifiedSchema = metadataObject;
  if (metadataObject?.allOf?.length === 1) {
    const { allOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = {
      ...strippedSchema,
      ...simplifyMetadataDefinition(allOf[0]),
    };
  } else if (metadataObject?.oneOf?.length === 1) {
    const { oneOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = {
      ...strippedSchema,
      ...simplifyMetadataDefinition(oneOf[0]),
    };
  } else if (metadataObject?.anyOf?.length === 1) {
    const { anyOf, ...strippedSchema } = metadataObject;
    simplifiedSchema = {
      ...strippedSchema,
      ...simplifyMetadataDefinition(anyOf[0]),
    };
  }
  return simplifiedSchema;
}

export function returnMarkdown(metadataObject: JSONSchema7): string {
  handleSchemaDefinition(metadataObject);

  return markdownArray.reverse().join('\n\n');
}

export function handleSchemaDefinition(metadataObject: JSONSchema7Definition): string {
  metadataObject = simplifyMetadataDefinition(metadataObject);

  if (metadataObject.$ref) {
    metadataObject = handleRef(metadataObject);
    // TODO: investigate. the following should solve the undefined issue, but leads to objects not being outputted instead
    // metadataObject = simplifyMetadataDefinition(metadataObject);
  }

  if (!metadataObject) {
    return;
  }

  let typeDefinition = ``;

  const refTitle = getTitle(metadataObject);

  if (refTitle && Object.keys(visitedRefs).includes(refTitle)) {
    return visitedRefs[refTitle];
  }

  if (refTitle) {
    //hack: add to visited refs early to avoid infinite loops. the actual value is set at the end of the fn.
    visitedRefs[refTitle] = getRefLink(metadataObject);
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

  // Deal with objects
  if (type === 'object') {
    typeDefinition = handleObject(metadataObject);
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

  if (refTitle) {
    // set visited ref to typeDefinition
    visitedRefs[refTitle] = typeDefinition;
  }

  return typeDefinition;
}

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

function handleArrayType(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  if (type === 'array') {
    const itemType = Array.isArray(metadataObject.items) ? metadataObject.items[0] : metadataObject.items;
    return `[${handleSchemaDefinition(itemType)}]`;
  }
}

function handleObject(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  if (type === 'object') {
    let markdown = '';

    markdown += `\n### ${getTitle(metadataObject)}\n\n`;

    if (metadataObject.description) markdown += `${metadataObject.description}\n\n`;

    markdown += `| Name | Type | Required | Description |\n|-----|-----|-----|-----|\n`;

    if(metadataObject.properties) {
      for (const [propertyKey, propertySchema] of Object.entries(metadataObject.properties)) {
        const propertyType = handleSchemaDefinition(propertySchema);
        const requiredProp = metadataObject.required && metadataObject.required.includes(propertyKey);
        markdown += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${propertySchema.description || ''} |\n`;
      }
    }

    if (metadataObject.additionalProperties) {
      markdown += `| \`<customKey>\` | ${handleSchemaDefinition(metadataObject.additionalProperties)} | No | ${
          metadataObject.additionalProperties.description || ''
      } |\n`;
    }

    if (metadataObject.examples) {
      markdown += `\n #### Example\n\n\`\`\`yaml\n${jsYaml.dump(metadataObject.examples[0])}\`\`\``
    }

    markdownArray.push(markdown);

    return getRefLink(metadataObject);
  }
  return ``;
}

function handleAllOf(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.allOf.map(option => {
    return handleSchemaDefinition(option);
  });
  return objectRefs.join(` / `);
}

function handleAnyOf(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.anyOf.map(option => {
    return handleSchemaDefinition(option);
  });
  return objectRefs.join(` / `);
}

function handleOneOf(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.oneOf.map(option => {
    return handleSchemaDefinition(option);
  });
  return objectRefs.join(` / `);
}
