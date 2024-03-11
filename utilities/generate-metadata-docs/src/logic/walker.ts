import { readFileSync } from 'fs';
import { JSONSchema7, JSONSchema7Definition } from '../entities';
import { removeNewLineCharacter } from './helpers';
import jsYaml from 'js-yaml';

const parentSchema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

// Unique identifier for each object based on title
type UniqueIdentifier = string;

// TODO: generateMarkdownForJsonSchema
// ✅ object.const -> returnable
// ✅ object.enum -> returnable
// ☝️ not recursive
// object.type === array -> array.items returnable, looping
// ✅ object.type === object && object.properties -> returnable
// ✅ object.type === object && object.additionalProperties -> returnable
// ✅ object.type === scalar -> returnable
// ✅ object.oneOf, anyOf -> returnable OR type This is the piped type of output
// ✅ object.allOf -> special case, has to be one of the fancy properties
export function handleSchemaDefinition(metadataObject: JSONSchema7Definition): JSONSchema7 {
  // Deal with const
  handleConst(metadataObject);

  // Deal with enum
  handleEnum(metadataObject);

  // Deal with scalars
  handleScalars(metadataObject);

  // Deal with properties
  handleProperties(metadataObject);

  // Deal with oneOf
  handleOneOf(metadataObject);

  // Deal with refs
  handleRef(metadataObject);

  // Deal with allOfs
  handleAllOf(metadataObject);

  // Deal with items
  handleItems(metadataObject);

  // Deal with additional properties
  handleAdditionalProperties(metadataObject);

  // Deal with anyOf
  simplifyAnyOf(metadataObject);

  return metadataObject;
}

function handleConst(metadataObject: JSONSchema7Definition) {
  if (metadataObject.const) {
    console.log(`Encountered const: ${metadataObject.const}`);
    return metadataObject;
  }
}

function handleEnum(metadataObject: JSONSchema7Definition) {
  if (metadataObject.enum) {
    console.log(`Encountered enum: ${metadataObject.enum}`);
    return metadataObject;
  }
}

function handleScalars(metadataObject: JSONSchema7Definition) {
  if (metadataObject.type) {
    const scalarTypes = [`string`, `integer`, `number`];
    if (scalarTypes.includes(metadataObject.type.toString())) {
      return metadataObject;
    }
  }
}

function handleOneOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.oneOf) {
    metadataObject.oneOf.map(option => {
      const oneOf = handleSchemaDefinition(option);
      console.log(oneOf);
    });
  }
}

function handleProperties(metadataObject: JSONSchema7Definition) {
  if (metadataObject.type && metadataObject.type === 'object') {
    if (metadataObject.properties) {
      for (const [key, value] of Object.entries(metadataObject.properties)) {
        const prop = handleSchemaDefinition(value);
        console.log(prop);
      }
    }
  }
}

function handleRef(metadataObject: JSONSchema7Definition) {
  if (metadataObject.$ref) {
    const ref = metadataObject.$ref;
    const parsedRef = ref.split('/').pop();
    const referencedObject = parentSchema.definitions[parsedRef];
    // This keeps us from dealing with external refs like http...
    if (referencedObject != undefined) {
      const newReference = handleSchemaDefinition(referencedObject);
      console.log(newReference);
    } else {
      console.warn(`This is a non-local definition: ${ref}`);
    }
  }
}

function handleAllOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.allOf) {
    for (const [key, value] of Object.entries(metadataObject.allOf)) {
      const allOf = handleSchemaDefinition(value);
      console.log(allOf);
    }
  }
}

function handleItems(metadataObject: JSONSchema7Definition) {
  if (metadataObject.items) {
    if (Array.isArray(metadataObject.items)) {
      metadataObject.items.forEach(item => {
        const referencedItem = handleRef(item);
        console.log(referencedItem);
      });
    }
  }
}

function handleAdditionalProperties(metadataObject: JSONSchema7Definition) {
  if (metadataObject.type === 'object') {
    if (metadataObject.additionalProperties) {
      for (const [key, value] of Object.entries(metadataObject.additionalProperties)) {
        if (key === '$ref') {
          const additionalProp = handleRef({ $ref: value });
          console.log(additionalProp);
        }
      }
    }
  }
}

function simplifyAnyOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.anyOf) {
    const simplifiedAnyOf = metadataObject.anyOf.filter(obj => obj.type != 'null');
    simplifiedAnyOf.map(item => {
      if (item['$ref']) {
        const anyOf = handleRef(simplifiedAnyOf[0]);
        console.log(anyOf);
      }
    });
  }
}

function addTitle(metadataObject: JSONSchema7Definition) {
  if (metadataObject.title) {
    return `\n\n### ${metadataObject.title}\n`;
  }
}

function addDescription(metadataObject: JSONSchema7Definition) {
  if (metadataObject.description) {
    return `\n${metadataObject.description}\n`;
  }
}
