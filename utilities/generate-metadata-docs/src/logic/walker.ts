import { readFileSync } from 'fs';
import { JSONSchema7, JSONSchema7Definition } from '../entities';
import jsYaml from 'js-yaml';

const parentSchema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

let markdownArray: string[] = [];

let visitedRefs: Record<string, any> = {};

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
  return `[${getTitle(metadataObject)}](#${formatLink(getTitle(metadataObject))})`;
}

function getParsedRef(ref: string): string {
  return ref?.split('/')?.pop();
}

function handleRef(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
  const ref = metadataObject.$ref;

  const refPath = ref.split('/');
  let refObject = parentSchema;
  refPath.forEach(path => {
    if (path !== '#') {
      refObject = refObject?.[path];
    }
  });

  if (refObject !== undefined) {
    return simplifyMetadataDefinition({ ...metadataObject, ...refObject });
  } else {
    console.warn('Ref not found: ', ref);
  }
}

function simplifyMetadataDefinition(metadataObject: JSONSchema7Definition): JSONSchema7Definition {
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

// Checks if the given metadataObject is a `oneOf` with each variant being discriminated
// by the presence of a particular field and the variant specific fields nested
// within.
function isExternallyTaggedOneOf(metadataObject: JSONSchema7Definition): boolean {
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
function isExternallyTaggedNullable(metadataObject: JSONSchema7Definition): boolean {
  return (
    metadataObject.anyOf &&
    metadataObject.anyOf.length === 2 &&
    metadataObject.anyOf.some(sub_object => sub_object.type === 'null')
  );
}

export function returnMarkdown(metadataObject: JSONSchema7): string {
  handleSchemaDefinition(metadataObject);

  return markdownArray.reverse().join('\n\n');
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

  // Deal with properties / additionalProperties
  if (type === 'object') {
    typeDefinition = handleObject(metadataObject);
  }

  if (metadataObject.anyOf && isExternallyTaggedNullable(metadataObject)) {
    typeDefinition = handleExternallyTaggedNullable(metadataObject);
  } else if (metadataObject.oneOf && isExternallyTaggedOneOf(metadataObject)) {
    typeDefinition = handleExternallyTaggedOneOf(metadataObject);
  } else if (metadataObject.oneOf || metadataObject.allOf || metadataObject.anyOf) {
    typeDefinition = handleAllOfAnyOfOneOf(metadataObject);
  }

  if (refTitle) {
    // set visited ref to typeDefinition
    visitedRefs[refTitle] = typeDefinition;
  }

  return typeDefinition;
}

function handleConst(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.const) {
    return metadataObject.const.toString();
  }
}

function handleEnum(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.enum) {
    return metadataObject.enum.join(' / ');
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
    const title = getTitle(metadataObject);

    let markdown = '';

    markdown += `\n### ${title}\n\n`;

    if (metadataObject.description) markdown += `${metadataObject.description}\n\n`;

    markdown += `| Name | Type | Required | Description |\n|-----|-----|-----|-----|\n`;

    if (metadataObject.properties) {
      for (const [propertyKey, propertySchema] of Object.entries(metadataObject.properties)) {
        const propertyType = handleSchemaDefinition(propertySchema);
        const requiredProp = metadataObject.required ? metadataObject.required.includes(propertyKey) : false;
        markdown += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${
          propertySchema.description || ''
        } |\n`;
      }
    }

    if (metadataObject.additionalProperties) {
      const propertySchema = metadataObject.additionalProperties;
      const propertyType = handleSchemaDefinition(propertySchema);
      markdown += `| \`<customKey>\` | ${propertyType} | false | ${propertySchema.description || ''} |\n`;
    }

    if (metadataObject.examples) {
      markdown += `\n **Example**\n\n\`\`\`yaml\n${jsYaml.dump(metadataObject.examples[0])}\`\`\``;
    }

    markdownArray.push(markdown);

    return getRefLink(metadataObject);
  }
  return ``;
}

function handleAllOfAnyOfOneOf(metadataObject: JSONSchema7Definition): string {
  const title = getTitle(metadataObject);

  let markdown = '';

  markdown += `\n### ${title}\n\n`;

  if (metadataObject.description) markdown += `${metadataObject.description}\n\n`;

  const objectRefs = (metadataObject.allOf || metadataObject.anyOf || metadataObject.oneOf).map(option => {
    return handleSchemaDefinition(option);
  });

  markdown += objectRefs.join(` / `);

  markdownArray.push(markdown);

  return getRefLink(metadataObject);
}

function handleExternallyTaggedNullable(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.anyOf.map(option => {
    return handleSchemaDefinition(option);
  });

  return objectRefs.join(` / `);
}

function handleExternallyTaggedOneOf(metadataObject: JSONSchema7Definition): string {
  const title = getTitle(metadataObject);

  let markdown = '';

  markdown += `\n### ${title}\n\n`;

  if (metadataObject.description) markdown += `${metadataObject.description}\n\n`;

  markdown += '\nMust have exactly one of the following fields:\n\n';
  markdown += `| Name | Type | Required | Description |\n|-----|-----|-----|-----|\n`;
  metadataObject.oneOf.forEach(sub_object => {
    let [propertyKey, propertySchema] = Object.entries(sub_object.properties)[0];
    const propertyType = handleSchemaDefinition(propertySchema);
    const requiredProp = false;
    markdown += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${propertySchema.description || ''} |\n`;
  });

  markdownArray.push(markdown);

  return getRefLink(metadataObject);
}
