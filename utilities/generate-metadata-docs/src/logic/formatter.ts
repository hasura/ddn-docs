import { JSONSchema7, JSONSchema7Definition } from '../entities/types';

/**
 * Whenever we run into a $ref, we need to find it in the schema's definitions
 */
function resolveRef(schema: JSONSchema7, ref: string): JSONSchema7Definition | undefined {
  const refPath = ref.substring(ref.lastIndexOf('/') + 1);
  return schema.definitions ? schema.definitions[refPath] : undefined;
}

/**
 * Opposed to recursively creating markdown, we're choosing to generate "expanded" JSON which is generated
 * by traversing the original schema and recursively plugging in refs where appropriate.
 */
function constructSchemaJson(schema: JSONSchema7, schemaObject: JSONSchema7 | JSONSchema7Definition): any {
  if (typeof schemaObject === 'boolean') {
    return { type: 'boolean' };
  }

  let result: any = {};

  const keysToCheck = ['title', 'description', 'type', 'enum', 'additionalProperties', 'required', 'examples'];
  keysToCheck.forEach(key => {
    if (key in schemaObject) {
      result[key as keyof JSONSchema7] = schemaObject[key as keyof JSONSchema7];
    }
  });

  // Resolve $ref when we find it
  if ('$ref' in schemaObject && typeof schemaObject['$ref'] === 'string') {
    const resolvedSchema = resolveRef(schema, schemaObject['$ref']);
    if (resolvedSchema && typeof resolvedSchema !== 'boolean') {
      result['$ref'] = schemaObject['$ref'];
      Object.assign(result, constructSchemaJson(schema, resolvedSchema));
    } else {
      result['error'] = `Could not resolve ref: ${schemaObject['$ref']}`;
    }
    return result;
  }

  // Recursively process properties because there's undoubtedly nested 💩 in there
  if ('properties' in schemaObject && typeof schemaObject.properties === 'object') {
    result.properties = {};
    for (const propName in schemaObject.properties) {
      const prop = schemaObject.properties[propName];
      result.properties[propName] = constructSchemaJson(schema, prop);
    }
  }

  // Deal with anyOf, allOf, oneOf — keep on diving
  const compositeKeywords: Array<'anyOf' | 'allOf' | 'oneOf'> = ['anyOf', 'allOf', 'oneOf'];
  compositeKeywords.forEach(keyword => {
    const compositeArray = schemaObject[keyword];
    if (Array.isArray(compositeArray)) {
      result[keyword] = compositeArray.map(subSchema => constructSchemaJson(schema, subSchema));
    }
  });

  return result;
}

/**
 * This wrapper lets us process the schema recursively and outputs it in...JSON.
 * I promise it makes sense because the generated object can now be compared to
 * our top-level array of pages / subgraph objects.
 */
export function processSchemaToJson(schema: JSONSchema7): string {
  const schemaStructure = constructSchemaJson(schema, schema);
  return JSON.stringify(schemaStructure, null, 2);
}
