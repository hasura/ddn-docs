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
function constructSchemaJson(
  schema: JSONSchema7,
  schemaObject: JSONSchema7 | JSONSchema7Definition,
  visitedRefs = new Set()
): any {
  // Check for circular reference
  if (typeof schemaObject === 'object' && schemaObject['$ref'] && visitedRefs.has(schemaObject['$ref'])) {
    return { error: 'Circular reference detected' };
  }

  // Add the current $ref to visitedRefs
  if (typeof schemaObject === 'object' && schemaObject['$ref']) {
    visitedRefs.add(schemaObject['$ref']);
  }

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
      Object.assign(result, constructSchemaJson(schema, resolvedSchema, visitedRefs));
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
      // Initialize an object to hold the processed property schema
      let processedProp: any = {};

      // Check if the property is an array with an 'items' schema
      if (typeof prop === 'object' && prop.items) {
        // Recursively process the 'items' schema
        if (Array.isArray(prop.items)) {
          // If 'items' is an array, process each schema in the array (less common)
          processedProp.items = prop.items.map(item => constructSchemaJson(schema, item, visitedRefs));
        } else {
          // If 'items' is an object, process it directly
          processedProp.items = constructSchemaJson(schema, prop.items, visitedRefs);
        }
      }

      // Process the rest of the property schema
      processedProp = { ...processedProp, ...constructSchemaJson(schema, prop, visitedRefs) };

      // Assign the processed property schema to the result
      result.properties[propName] = processedProp;
    }
  }

  // Handle 'additionalProperties' if present
  if ('additionalProperties' in schemaObject) {
    const additionalProps = schemaObject.additionalProperties;

    // Check if 'additionalProperties' is a schema object or boolean
    if (typeof additionalProps === 'object') {
      // Recursively process the schema for 'additionalProperties'
      result.additionalProperties = constructSchemaJson(schema, additionalProps, visitedRefs);
    } else {
      // If 'additionalProperties' is a boolean, directly assign it
      result.additionalProperties = additionalProps;
    }
  }

  // Deal with anyOf, allOf, oneOf — keep on diving
  const compositeKeywords: Array<'anyOf' | 'allOf' | 'oneOf'> = ['anyOf', 'allOf', 'oneOf'];
  compositeKeywords.forEach(keyword => {
    const compositeArray = schemaObject[keyword];
    if (Array.isArray(compositeArray)) {
      result[keyword] = compositeArray.map(subSchema => constructSchemaJson(schema, subSchema, visitedRefs));
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
