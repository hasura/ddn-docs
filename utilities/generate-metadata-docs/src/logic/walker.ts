import { readFileSync } from 'fs';
import { JSONSchema7, JSONSchema7Definition } from '../entities';
import { removeNewLineCharacter } from './helpers';
import jsYaml from 'js-yaml';

const parentSchema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

// Unique identifier for each object based on title
type UniqueIdentifier = string;

// TODO: generateMarkdownForJsonSchema
// object.const -> returnable
// object.enum -> returnable
// ☝️ not recursive
// object.type === array -> array.items returnable, looping
// object.type === object && object.properties -> returnable
// object.type === object && object.additionalProperties -> returnable
// object.type === scalar -> returnable
// object.oneOf, anyOf -> returnable OR type This is the piped type of output
// object.allOf -> special case, has to be one of the fancy properties
export function handleSchemaDefinition(metadataObject: JSONSchema7Definition): JSONSchema7 {
  let md = ``;

  // Deal with scalars
  const scalars = ['string', 'int', 'number'];
  scalars.map(scalarType => {
    if (metadataObject.type && metadataObject.type.toString() === scalarType) {
      return metadataObject;
    }
  });

  // Deal with metadata object that is of type object and has properties
  if (metadataObject.type === 'object' && metadataObject.properties) {
    return metadataObject;
  }

  if (metadataObject.type === 'object' && metadataObject.additionalProperties) {
    return metadataObject;
  }

  // Add a title if it's available
  md += addTitle(metadataObject);

  // Add a description if it's available
  md += addDescription(metadataObject);

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

  console.log(md);

  return metadataObject;
}

function handleOneOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.oneOf) {
    metadataObject.oneOf.map(option => {
      handleSchemaDefinition(option);
    });
  }
}

function handleProperties(metadataObject: JSONSchema7Definition) {
  if (metadataObject.properties) {
    for (const [key, value] of Object.entries(metadataObject.properties)) {
      handleSchemaDefinition(value);
    }
  }
}

function handleRef(metadataObject: JSONSchema7Definition) {
  if (metadataObject.$ref) {
    console.log(`Handling ref...`);
    const ref = metadataObject.$ref;
    const parsedRef = ref.split('/').pop();
    const referencedObject = parentSchema.definitions[parsedRef];
    // This keeps us from dealing with external refs like http...
    if (referencedObject != undefined) {
      handleSchemaDefinition(referencedObject);
    }
  }
}

function handleAllOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.allOf) {
    for (const [key, value] of Object.entries(metadataObject.allOf)) {
      handleSchemaDefinition(value);
    }
  }
}

function handleItems(metadataObject: JSONSchema7Definition) {
  if (metadataObject.items) {
    if (Array.isArray(metadataObject.items)) {
      metadataObject.items.forEach(item => {
        handleRef(item);
      });
    }
  }
}

function handleAdditionalProperties(metadataObject: JSONSchema7Definition) {
  if (metadataObject.additionalProperties) {
    for (const [key, value] of Object.entries(metadataObject.additionalProperties)) {
      if (key === '$ref') {
        handleRef({ $ref: value });
      }
    }
  }
}

function simplifyAnyOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.anyOf) {
    const simplifiedAnyOf = metadataObject.anyOf.filter(obj => obj.type != 'null');
    simplifiedAnyOf.map(item => {
      if (item['$ref']) {
        handleRef(simplifiedAnyOf[0]);
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
