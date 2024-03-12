import { readFileSync } from 'fs';
import { JSONSchema7, JSONSchema7Definition } from '../entities';
import { removeNewLineCharacter } from './helpers';
import jsYaml from 'js-yaml';

const parentSchema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

let markdown = ``;

let visitedRefs = {};

export function returnMarkdown(metadataObject: JSONSchema7): void {
  handleSchemaDefinition(metadataObject);
  console.log(markdown);
}

export function handleSchemaDefinition(metadataObject: JSONSchema7Definition): string {
  metadataObject = simplifyMetadataDefinition(metadataObject);

  if (metadataObject.$ref) {
    metadataObject = handleRef(metadataObject);
  }

  if (!metadataObject) {
    console.log(`Shit`);
    return;
  }

  const refTitle = metadataObject.title || metadataObject.$ref?.split('/')?.pop();

  if (refTitle && Object.keys(visitedRefs).includes(refTitle)) {
    // return visitedRefs[metadataObject.title || metadataObject.$ref];
    return visitedRefs[refTitle];
  }

  if (refTitle) {
    visitedRefs[refTitle] = refTitle;
  }

  let md = ``;

  // Deal with const
  if (metadataObject.const) {
    md = handleConst(metadataObject);
  }

  // Deal with enum
  if (metadataObject.enum) {
    md = handleEnum(metadataObject);
  }

  // Deal with scalars
  const type = getType(metadataObject);
  const scalarTypes = [`string`, `number`, `integer`, `null`, `boolean`];
  if (type && scalarTypes.includes(type)) {
    md = handleScalars(metadataObject);
  }

  // Deal with items
  if (type === 'array') {
    md = handleArrayType(metadataObject);
  }

  // Deal with oneOf
  if (metadataObject.oneOf) {
    md = handleOneOf(metadataObject);
  }

  // Deal with allOfs
  if (metadataObject.allOf) {
    md = handleAllOf(metadataObject);
  }

  // Deal with anyOfs
  if (metadataObject.anyOf) {
    md = handleAnyOf(metadataObject);
  }

  // Deal with properties
  if (metadataObject.properties && type === 'object') {
    md = handleProperties(metadataObject);
  }

  // Deal with additionalProperties first
  if (metadataObject.additionalProperties && type === 'object') {
    md = handleAdditionalProperties(metadataObject);
  }

  // // Deal with anyOf
  // simplifyAnyOf(metadataObject);

  if (refTitle) {
    visitedRefs[refTitle] = md;
  }

  return md;
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

function getType(metadata: JSONSchema7Definition): string | void {
  if (metadata.type) {
    if (Array.isArray(metadata.type)) {
      return metadata.type[0];
    } else {
      return metadata.type;
    }
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
  } else if (metadataObject?.anyOf?.length > 1) {
    const { anyOf, ...strippedSchema } = metadataObject;
    const filtered = metadataObject.anyOf.filter(option => option.type != 'null');
    // console.log(filtered);
    // filtered.map((ref) => {

    // })
    // simplifiedSchema = simplifyMetadataDefinition(filtered[0]);
    // simplifiedSchema = {
    //   ...strippedSchema,
    //   ...simplifiedSchema,
    // };
  }
  return simplifiedSchema;
}

function handleOneOf(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.oneOf) {
    const objectRefs = metadataObject.oneOf.map(option => {
      return handleSchemaDefinition(option);
    });
    return objectRefs.join(` or `);
  }
  return ``;
}

function handleProperties(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.type && metadataObject.type === 'object') {
    markdown += `\n### ${metadataObject.title}\n\n${metadataObject.description || ''}\n\n`;
    markdown += `\n| Name | Type | Required | Description |\n|-----|-----|-----|-----|\n`;
    for (const [key, value] of Object.entries(metadataObject.properties)) {
      const prop = setPropertyInformation(value, metadataObject, key);
      markdown += `| \`${key}\` | ${prop.propType} | ${prop.required} | ${prop.description} |\n`;
    }
    return `[${metadataObject?.title}](#${metadataObject?.title?.toLocaleLowerCase()})`;
  }
  return ``;
}

function handleAdditionalProperties(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.type && metadataObject.type === 'object') {
    markdown += `\n### ${metadataObject.title || ``}\n\n${metadataObject.description || ''}\n\n`;
    markdown += `\n| Name | Type | Required | Description |\n|-----|-----|-----|-----|\n`;
    markdown += `| \`customKey\` | ${handleSchemaDefinition(metadataObject.additionalProperties)} | No | ${
      metadataObject.additionalProperties.description ? metadataObject.additionalProperties.description : ``
    } |\n`;
    return `[${metadataObject?.title}](#${metadataObject?.title?.toLocaleLowerCase()})`;
  }
  return ``;
}

function handleRef(metadataObject: JSONSchema7Definition) {
  const ref = metadataObject.$ref;
  const parsedRef = ref.split('/').pop();
  const referencedObject = parentSchema.anyOf[0].definitions[parsedRef];
  if (referencedObject != undefined) {
    return { ...metadataObject, ...referencedObject };
  } else {
    console.warn(`This is a non-local definition: ${ref}`);
  }
}

function handleAllOf(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.allOf) {
    const objectRefs = metadataObject.allOf.map(option => {
      return handleSchemaDefinition(option);
    });
    return objectRefs.join(` or `);
  }
  return ``;
}

function handleAnyOf(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.anyOf.map(option => {
    const definition = handleSchemaDefinition(option);
    return definition;
  });
  return objectRefs.join(` or `);
}

// function getMetadataObjectRef(metadata: JSONSchema7Definition): string {

// }

function handleArrayType(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  if (type === 'array') {
    const itemType = Array.isArray(metadataObject.items) ? metadataObject.items[0] : metadataObject.items;
    return `[${handleSchemaDefinition(itemType)}]`;
  }
}

function simplifyAnyOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.anyOf) {
    const simplifiedAnyOf = metadataObject.anyOf.filter(obj => obj.type != 'null');
    simplifiedAnyOf.map(item => {
      if (item['$ref']) {
        const anyOf = handleRef(simplifiedAnyOf[0]);
      }
    });
  }
}

/**
 * Everything below this comment is for styling / filling in content in the desired format.
 */

// This adds a title if the metadata object has one
function addTitle(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.title) {
    return `\n\n### ${parseV1FromTitle(metadataObject.title)}\n`;
  } else {
    return '';
  }
}

// This strips V1 from a metadata object
function parseV1FromTitle(title: string): string {
  if (title.includes(`V1`)) {
    return title.replace(`V1`, '');
  } else {
    return title;
  }
}

// This adds a description
function addDescription(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.description && metadataObject.properties) {
    return `\n${metadataObject.description}\n`;
  } else {
    return '';
  }
}

// This type is used to ensure we're adding the correct information to any row in a `properties` table
type RefinedProperty = {
  propName: string;
  propType: string;
  required: string;
  description: string;
};

/**
 * This uses the `RefinedProperty` type to write a row based on the passed values of:
 * @param property
 * @param parentObject
 * @param propertyKey
 * @param referencedObject
 * @returns
 */
function setPropertyInformation(
  property: JSONSchema7,
  parentObject: JSONSchema7,
  propertyKey: string
): RefinedProperty {
  let propertyDetails = {
    propName: ``,
    propType: ``,
    required: `No`, // doing this so we can have a default and overwrite it
    description: ``,
  };

  propertyDetails.propName = propertyKey;

  if (propertyKey === 'source') {
    // console.log(property);
  }

  propertyDetails.propType = handleSchemaDefinition(property);

  if (property.description) {
    propertyDetails.description = property.description;
  }

  if (parentObject.required && parentObject.required.includes(propertyKey)) {
    propertyDetails.required = `Yes`;
  }

  return propertyDetails;
}
