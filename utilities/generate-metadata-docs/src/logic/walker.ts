import { JSONSchema7Definition } from '../entities/types';
import {
  generateSchemaObjectMarkdown,
  getArrayItemType,
  getDescription,
  getExamples,
  getRefLink,
  getTitle,
  getType,
  handleRef,
  isExternallyTaggedNullable,
  isExternallyTaggedOneOf,
  isScalarType,
  simplifyMetadataDefinition,
} from './helpers';
import { topLevelMetadataRefs } from '../entities/objects';

let markdownArray: string[] = [];
let visitedRefs = topLevelMetadataRefs;

export function returnMarkdown(metadataObject: JSONSchema7Definition): string {
  // reset base values
  markdownArray = [];
  visitedRefs = topLevelMetadataRefs;

  handleSchemaDefinition(metadataObject, true);

  return markdownArray.reverse().join('\n\n');
}

// generate Schema markdownArray and return reference of Schema
function handleSchemaDefinition(metadataObject: JSONSchema7Definition, isSource: boolean = false): string {
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
    typeDefinition = handleObject(metadataObject, isSource);
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
    const value = `\`${metadataObject.const.toString()}\``;

    const title = getTitle(metadataObject);
    if (title) {
      const markdownValue = `\n**Value:** ${value}`;
      const markdown = generateSchemaObjectMarkdown(metadataObject, markdownValue);
      markdownArray.push(markdown);

      return getRefLink(metadataObject);
    } else {
      return value;
    }
  }
}

function handleEnum(metadataObject: JSONSchema7Definition): string {
  if (metadataObject.enum) {
    const value = metadataObject.enum.map(enumVal => `\`${enumVal}\``).join(' / ');

    const title = getTitle(metadataObject);
    if (title) {
      const markdownValue = `\n**Value:** ${value}`;
      const markdown = generateSchemaObjectMarkdown(metadataObject, markdownValue);
      markdownArray.push(markdown);

      return getRefLink(metadataObject);
    } else {
      return value;
    }
  }
}

function handleScalars(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  if (type && isScalarType(metadataObject)) {
    const value = type;

    const title = getTitle(metadataObject);
    if (title) {
      const markdownValue = `\n**Value:** ${value}`;
      const markdown = generateSchemaObjectMarkdown(metadataObject, markdownValue);
      markdownArray.push(markdown);

      return getRefLink(metadataObject);
    } else {
      return value;
    }
  }
}

function handleArrayType(metadataObject: JSONSchema7Definition): string {
  const type = getType(metadataObject);
  if (type === 'array') {
    const itemType = getArrayItemType(metadataObject);
    return `[${handleSchemaDefinition(itemType)}]`;
  }
}

function handleObject(metadataObject: JSONSchema7Definition, isSource: boolean = false): string {
  const type = getType(metadataObject);
  if (type === 'object') {
    let markdownValue = '';
    markdownValue += `| Key | Schema | Required | Description |\n|-----|-----|-----|-----|\n`;

    if (metadataObject.properties) {
      for (const [propertyKey, propertySchema] of Object.entries(metadataObject.properties)) {
        const propertyType = handleSchemaDefinition(propertySchema);
        const requiredProp = metadataObject.required ? metadataObject.required.includes(propertyKey) : false;
        markdownValue += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${getDescription(propertySchema)} |\n`;
      }
    }

    if (metadataObject.additionalProperties) {
      const propertySchema = metadataObject.additionalProperties;
      const propertyType = handleSchemaDefinition(propertySchema);
      markdownValue += `| \`<customKey>\` | ${propertyType} | false | ${getDescription(propertySchema)} |\n`;
    }

    const markdown = generateSchemaObjectMarkdown(metadataObject, markdownValue, isSource);

    markdownArray.push(markdown);

    return getRefLink(metadataObject);
  }
  return ``;
}

function handleAllOfAnyOfOneOf(metadataObject: JSONSchema7Definition): string {
  let markdownValue = '';
  markdownValue += '\n**One of the following values:**\n\n';
  markdownValue += `| Value | Description |\n|-----|-----|\n`;
  (metadataObject.allOf || metadataObject.anyOf || metadataObject.oneOf).forEach(option => {
    const valueType = handleSchemaDefinition(option);
    markdownValue += `| ${valueType} | ${getDescription(option)} |\n`;
  });

  const markdown = generateSchemaObjectMarkdown(metadataObject, markdownValue);

  markdownArray.push(markdown);

  return getRefLink(metadataObject);
}

function handleExternallyTaggedNullable(metadataObject: JSONSchema7Definition): string {
  const objectRefs = metadataObject.anyOf.map(option => {
    return handleSchemaDefinition(option);
  });

  const value = objectRefs.join(` / `);

  const title = getTitle(metadataObject);
  if (title) {
    const markdownValue = `\n**Value:** ${value}`;
    const markdown = generateSchemaObjectMarkdown(metadataObject, markdownValue);
    markdownArray.push(markdown);

    return getRefLink(metadataObject);
  } else {
    return value;
  }
}

function handleExternallyTaggedOneOf(metadataObject: JSONSchema7Definition): string {
  let markdownValue = '';
  markdownValue += '\n**Must have exactly one of the following fields:**\n\n';
  markdownValue += `| Key | Schema | Required | Description |\n|-----|-----|-----|-----|\n`;
  metadataObject.oneOf.forEach(sub_object => {
    let [propertyKey, propertySchema] = Object.entries(sub_object.properties)[0];
    const propertyType = handleSchemaDefinition(propertySchema);
    const requiredProp = false;
    markdownValue += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${getDescription(propertySchema)} |\n`;
  });

  const markdown = generateSchemaObjectMarkdown(metadataObject, markdownValue);

  markdownArray.push(markdown);

  return getRefLink(metadataObject);
}
