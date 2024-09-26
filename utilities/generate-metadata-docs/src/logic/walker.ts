import { JSONSchema7Definition, JSONSchema7 } from '../entities/types';
import {
  generateScalarMarkdown,
  generateSchemaObjectMarkdown,
  getArrayItemType,
  getDescription,
  getRefLink,
  getTitle,
  handleRef,
  isExternallyTaggedNullable,
  isExternallyTaggedOneOf,
  isArrayType,
  isObjectType,
  isScalarType,
  simplifyMetadataDefinition,
} from './helpers';
import { externalMetadataRefs, topLevelMetadataRefs } from '../entities/objects';
import crypto from 'crypto';

export function getSchemaMarkdown(metadataObject: JSONSchema7Definition): string {
  const markdownArray: string[] = [];
  const visitedRefs = new Map<string, string>([
    ...Object.entries(topLevelMetadataRefs),
    ...Object.entries(externalMetadataRefs),
  ]);

  // Needed to generate unique anchor tags
  const rootTitle = getTitle(metadataObject);

  // Function to generate a unique key for each schema
  function canonicalize(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(canonicalize);
    } else if (obj && typeof obj === 'object' && obj !== null) {
      const sortedKeys = Object.keys(obj).sort();
      const result: any = {};
      for (const key of sortedKeys) {
        result[key] = canonicalize(obj[key]);
      }
      return result;
    } else {
      return obj;
    }
  }

  function getSchemaKey(metadataObject: JSONSchema7Definition): string {
    if (metadataObject === null || metadataObject === undefined) {
      return '';
    }

    if (typeof metadataObject === 'object') {
      if ('$id' in metadataObject && metadataObject.$id) {
        return metadataObject.$id as string;
      } else if ('$ref' in metadataObject && metadataObject.$ref) {
        return metadataObject.$ref as string;
      } else if (getTitle(metadataObject)) {
        return getTitle(metadataObject);
      } else {
        // Canonicalize the schema and then hash it
        const canonicalSchema = canonicalize(metadataObject);
        const schemaString = JSON.stringify(canonicalSchema);
        const hash = crypto.createHash('sha256').update(schemaString).digest('hex');
        return hash;
      }
    } else {
      // For other types (e.g., boolean), return string representation
      return JSON.stringify(metadataObject);
    }
  }

  function handleBooleanSchema(metadataObject: boolean): string {
    const markdown = metadataObject ? 'This schema matches any value.' : 'This schema matches no values.';
    markdownArray.push(markdown);
    return markdown;
  }

  // Generate Schema markdownArray and return reference of Schema
  function handleSchemaDefinition(metadataObject: JSONSchema7Definition, isSource: boolean = false): string {
    metadataObject = simplifyMetadataDefinition(metadataObject);

    if (!metadataObject || typeof metadataObject !== 'object') {
      return '';
    }

    if ('$ref' in metadataObject && metadataObject.$ref) {
      metadataObject = handleRef(metadataObject);

      // After resolving $ref, check again
      if (typeof metadataObject === 'boolean') {
        return handleBooleanSchema(metadataObject);
      }

      if (!metadataObject || typeof metadataObject !== 'object') {
        return '';
      }
    }

    // Generate a unique key for the schema
    const schemaKey = getSchemaKey(metadataObject);

    if (visitedRefs.has(schemaKey) && !isSource) {
      return visitedRefs.get(schemaKey)!;
    }

    // Add to visitedRefs early to avoid infinite loops
    if (!isSource) {
      visitedRefs.set(schemaKey, getRefLink(metadataObject, rootTitle));
    }

    let typeDefinition = '';

    if ('type' in metadataObject && metadataObject.type) {
      if (Array.isArray(metadataObject.type)) {
        typeDefinition = handleMultipleTypes(metadataObject);
      } else {
        if (isScalarType(metadataObject.type)) {
          typeDefinition = handleScalars(metadataObject);
        } else if (isArrayType(metadataObject.type)) {
          typeDefinition = handleArray(metadataObject);
        } else if (isObjectType(metadataObject.type)) {
          typeDefinition = handleObject(metadataObject, isSource);
        }
      }
    } else if ('anyOf' in metadataObject && metadataObject.anyOf && isExternallyTaggedNullable(metadataObject)) {
      typeDefinition = handleExternallyTaggedNullable(metadataObject);
    } else if ('oneOf' in metadataObject && metadataObject.oneOf && isExternallyTaggedOneOf(metadataObject)) {
      typeDefinition = handleExternallyTaggedOneOf(metadataObject);
    } else if (metadataObject.oneOf || metadataObject.allOf || metadataObject.anyOf) {
      typeDefinition = handleAllOfAnyOfOneOf(metadataObject);
    }

    if (!isSource) {
      // Update the actual value in visitedRefs
      visitedRefs.set(schemaKey, typeDefinition);
    }

    return typeDefinition;
  }

  function handleMultipleTypes(metadataObject: JSONSchema7Definition): string {
    if (typeof metadataObject === 'boolean' || !Array.isArray(metadataObject.type)) return '';

    const typeRefs = metadataObject.type.map(type => {
      if (isScalarType(type)) {
        return type;
      } else if (isArrayType(type)) {
        return handleArray(metadataObject);
      } else if (isObjectType(type)) {
        return handleObject(metadataObject);
      } else {
        return '';
      }
    });

    const value = typeRefs.join(` / `);

    const title = getTitle(metadataObject);
    if (title) {
      const markdown = generateScalarMarkdown(metadataObject, value, rootTitle);
      markdownArray.push(markdown);

      return getRefLink(metadataObject, rootTitle);
    } else {
      return value;
    }
  }

  function handleScalars(metadataObject: JSONSchema7Definition): string {
    if (typeof metadataObject === 'boolean' || Array.isArray(metadataObject.type)) return '';

    let value: string;
    if ('const' in metadataObject && metadataObject.const !== undefined) {
      value = `\`${metadataObject.const.toString()}\``;
    } else if ('enum' in metadataObject && metadataObject.enum) {
      value = (metadataObject.enum as any[]).map(enumVal => `\`${enumVal}\``).join(' / ');
    } else {
      value = metadataObject.type as string;
    }

    const title = getTitle(metadataObject);
    if (title) {
      const markdown = generateScalarMarkdown(metadataObject, value, rootTitle);
      markdownArray.push(markdown);

      return getRefLink(metadataObject, rootTitle);
    } else {
      return value;
    }
  }

  function handleArray(metadataObject: JSONSchema7Definition): string {
    if (typeof metadataObject === 'boolean') return '';

    const itemType = getArrayItemType(metadataObject);
    const value = `[${handleSchemaDefinition(itemType)}]`;

    const title = getTitle(metadataObject);
    if (title) {
      const markdown = generateScalarMarkdown(metadataObject, value, rootTitle);
      markdownArray.push(markdown);

      return getRefLink(metadataObject, rootTitle);
    } else {
      return value;
    }
  }

  function handleObject(metadataObject: JSONSchema7Definition, isSource: boolean = false): string {
    if (typeof metadataObject === 'boolean') return '';

    let markdownValue = '';
    markdownValue += `| Key | Value | Required | Description |\n|-----|-----|-----|-----|\n`;

    // Handle properties and additionalProperties
    if ('properties' in metadataObject && metadataObject.properties) {
      for (const [propertyKey, propertySchema] of Object.entries(metadataObject.properties)) {
        const propertyType = handleSchemaDefinition(propertySchema);
        const requiredProp = metadataObject.required ? metadataObject.required.includes(propertyKey) : false;
        markdownValue += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${getDescription(
          propertySchema
        )} |\n`;
      }
    }

    if ('additionalProperties' in metadataObject && metadataObject.additionalProperties) {
      const propertySchema = metadataObject.additionalProperties;
      const propertyType = handleSchemaDefinition(propertySchema);
      markdownValue += `| \`<customKey>\` | ${propertyType} | false | ${getDescription(propertySchema)} |\n`;
    }

    const markdown = generateSchemaObjectMarkdown(metadataObject, markdownValue, rootTitle, isSource);

    markdownArray.push(markdown);

    return getRefLink(metadataObject, rootTitle);
  }

  function handleAllOfAnyOfOneOf(metadataObject: JSONSchema7Definition): string {
    if (typeof metadataObject === 'boolean') return '';

    let markdownValue = '';
    markdownValue += '\n**One of the following values:**\n\n';
    markdownValue += `| Value | Description |\n|-----|-----|\n`;
    const combinations = metadataObject.allOf || metadataObject.anyOf || metadataObject.oneOf;
    combinations!.forEach((option: JSONSchema7Definition) => {
      const valueType = handleSchemaDefinition(option);
      markdownValue += `| ${valueType} | ${getDescription(option)} |\n`;
    });

    const markdown = generateSchemaObjectMarkdown(metadataObject as JSONSchema7, markdownValue, rootTitle);

    markdownArray.push(markdown);

    return getRefLink(metadataObject, rootTitle);
  }

  function handleExternallyTaggedNullable(metadataObject: JSONSchema7Definition): string {
    if (typeof metadataObject === 'boolean') return '';

    const objectRefs = metadataObject.anyOf!.map((option: JSONSchema7Definition) => {
      return handleSchemaDefinition(option);
    });

    const value = objectRefs.join(` / `);

    const title = getTitle(metadataObject as JSONSchema7);
    if (title) {
      const markdown = generateScalarMarkdown(metadataObject as JSONSchema7, value, rootTitle);
      markdownArray.push(markdown);

      return getRefLink(metadataObject as JSONSchema7, rootTitle);
    } else {
      return value;
    }
  }

  function handleExternallyTaggedOneOf(metadataObject: JSONSchema7Definition): string {
    if (typeof metadataObject === 'boolean') return '';

    let markdownValue = '';
    markdownValue += '\n**Must have exactly one of the following fields:**\n\n';
    markdownValue += `| Key | Value | Required | Description |\n|-----|-----|-----|-----|\n`;
    metadataObject.oneOf!.forEach((sub_object: JSONSchema7Definition) => {
      if (typeof sub_object === 'boolean' || !('properties' in sub_object) || !sub_object.properties) return;
      const entries = Object.entries(sub_object.properties);
      if (entries.length === 0) return;
      const [propertyKey, propertySchema] = entries[0];
      const propertyType = handleSchemaDefinition(propertySchema);
      const requiredProp = false;
      markdownValue += `| \`${propertyKey}\` | ${propertyType} | ${requiredProp} | ${getDescription(
        propertySchema
      )} |\n`;
    });

    const markdown = generateSchemaObjectMarkdown(metadataObject as JSONSchema7, markdownValue, rootTitle);

    markdownArray.push(markdown);

    return getRefLink(metadataObject as JSONSchema7, rootTitle);
  }

  handleSchemaDefinition(metadataObject, true);

  // Return the combined markdown
  return markdownArray.reverse().join('\n\n');
}
