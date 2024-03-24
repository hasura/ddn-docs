import jsYaml from 'js-yaml';
import { JSONSchema7Definition } from '../entities/types';
import {
  getArrayItemType,
  getDescription,
  getRefLink,
  getTitle,
  getType,
  handleRef,
  isExternallyTaggedNullable,
  isExternallyTaggedOneOf,
  isScalarType,
  simplifyMetadataDefinition,
} from './helpers';
import { topLevelRefs } from '../entities/objects';

let markdownArray: string[] = [];

let visitedRefs = topLevelRefs;

export function returnMarkdown(metadataObject: JSONSchema7Definition): string {
  handleSchemaDefinition(metadataObject, true);

  return markdownArray.reverse().join('\n\n');
}

// generate Schema markdownArray and return reference of Schema
export function handleSchemaDefinition(metadataObject: JSONSchema7Definition, isSource: boolean = false): string {
  metadataObject = simplifyMetadataDefinition(metadataObject);

  if (metadataObject.$ref) {
    metadataObject = handleRef(metadataObject);
  }

  if (!metadataObject) {
    return;
  }

  let typeDefinition = ``;

  const refTitle = getTitle(metadataObject);

  if (refTitle && Object.keys(visitedRefs).includes(refTitle) && !isSource) {
    return visitedRefs[refTitle];
  }

  if (refTitle && !isSource) {
    //hack: add to visited refs early to avoid infinite loops. the actual value is set at the end of the fn.
    visitedRefs[refTitle] = getRefLink(metadataObject);
  }

  const type = getType(metadataObject);

  if (metadataObject.const) {
    typeDefinition = handleConst(metadataObject);
  } else if (metadataObject.enum) {
    typeDefinition = handleEnum(metadataObject);
  } else if (isScalarType(metadataObject)) {
    typeDefinition = handleScalars(metadataObject);
  } else if (type === 'array') {
    // Deal with items
    typeDefinition = handleArrayType(metadataObject);
  } else if (type === 'object') {
    // Deal with properties / additionalProperties
    typeDefinition = handleObject(metadataObject);
  } else if (metadataObject.anyOf && isExternallyTaggedNullable(metadataObject)) {
    typeDefinition = handleExternallyTaggedNullable(metadataObject);
  } else if (metadataObject.oneOf && isExternallyTaggedOneOf(metadataObject)) {
    typeDefinition = handleExternallyTaggedOneOf(metadataObject);
  } else if (metadataObject.oneOf || metadataObject.allOf || metadataObject.anyOf) {
    typeDefinition = handleAllOfAnyOfOneOf(metadataObject);
  }

  if (refTitle && !isSource) {
    // set visited ref to typeDefinition
    visitedRefs[refTitle] = typeDefinition;
  }

  return typeDefinition;
}

function handleConst(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.const) {
    return `\`${metadataObject.const.toString()}\``;
  }
}

function handleEnum(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.enum) {
    return metadataObject.enum.map(enumVal => `\`${enumVal}\``).join(' / ');
  }
}

function handleScalars(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  if (type && isScalarType(metadataObject)) {
    return type;
  }
}

function handleArrayType(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  if (type === 'array') {
    const itemType = getArrayItemType(metadataObject);
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

    markdown += `| Key | Schema | Required | Description |\n|-----|-----|-----|-----|\n`;

    if (metadataObject.properties) {
      for (const [propertyKey, propertySchema] of Object.entries(metadataObject.properties)) {
        const propertyType = handleSchemaDefinition(propertySchema);
        const requiredProp = metadataObject.required ? metadataObject.required.includes(propertyKey) : false;
        markdown += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${getDescription(propertySchema)} |\n`;
      }
    }

    if (metadataObject.additionalProperties) {
      const propertySchema = metadataObject.additionalProperties;
      const propertyType = handleSchemaDefinition(propertySchema);
      markdown += `| \`<customKey>\` | ${propertyType} | false | ${getDescription(propertySchema)} |\n`;
    }

    if (metadataObject.examples) {
      markdown += `\n **Example${metadataObject.examples.length > 1 ? 's' : ''}:**${metadataObject.examples.map(example => `\n\n\`\`\`yaml\n${jsYaml.dump(example)}\`\`\``)}`;
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

  markdown += '\n**One of the following values:**\n\n';

  markdown += `| Value | Description |\n|-----|-----|\n`;

  (metadataObject.allOf || metadataObject.anyOf || metadataObject.oneOf).forEach(option => {
    const valueType = handleSchemaDefinition(option);
    markdown += `| ${valueType} | ${getDescription(option)} |\n`;
  });

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

  markdown += '\n**Must have exactly one of the following fields:**\n\n';
  markdown += `| Key | Schema | Required | Description |\n|-----|-----|-----|-----|\n`;
  metadataObject.oneOf.forEach(sub_object => {
    let [propertyKey, propertySchema] = Object.entries(sub_object.properties)[0];
    const propertyType = handleSchemaDefinition(propertySchema);
    const requiredProp = false;
    markdown += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${getDescription(propertySchema)} |\n`;
  });

  markdownArray.push(markdown);

  return getRefLink(metadataObject);
}
