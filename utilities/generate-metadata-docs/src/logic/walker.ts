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
    return { ...metadataObject, ...refObject };
  } else {
    console.warn('Ref not found: ', ref);
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

  // Deal with properties / additionalProperties
  if (type === 'object') {
    typeDefinition = handleObject(metadataObject);
  }

  if (metadataObject.oneOf || metadataObject.allOf || metadataObject.anyOf) {
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
  const objectRefs = (metadataObject.allOf || metadataObject.anyOf || metadataObject.oneOf).map(option => {
    return handleSchemaDefinition(option);
  });

  const title = getTitle(metadataObject);

  // handle ref or null
  if (!title && objectRefs.length === 2 && objectRefs[1] === 'null') {
    return objectRefs.join(` / `);
  }

  let markdown = '';

  markdown += `\n### ${title}\n\n`;

  if (metadataObject.description) markdown += `${metadataObject.description}\n\n`;

  markdown += objectRefs.join(` / `);

  markdownArray.push(markdown);

  return getRefLink(metadataObject);
}
