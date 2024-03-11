import { readFileSync } from 'fs';
import { JSONSchema7, JSONSchema7Definition } from '../entities';
import { removeNewLineCharacter } from './helpers';
import jsYaml from 'js-yaml';

const parentSchema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

export function handleSchemaDefinition(metadataObject: JSONSchema7Definition): JSONSchema7 {
  let md = ``;

  md += addTitle(metadataObject);
  md += addDescription(metadataObject);

  // Deal with const
  handleConst(metadataObject);

  // Deal with enum
  handleEnum(metadataObject);

  // Deal with scalars
  handleScalars(metadataObject);

  // Deal with properties
  md += handleProperties(metadataObject);

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

/**
 * Everything from this to the next comment is for handling cases encountered when navigating
 * a JSONSchema7Definition.
 */
function handleConst(metadataObject: JSONSchema7Definition) {
  if (metadataObject.const) {
    // console.log(`Encountered const: ${metadataObject.const}`);
    return metadataObject;
  }
}

function handleEnum(metadataObject: JSONSchema7Definition) {
  if (metadataObject.enum) {
    // console.log(`Encountered enum: ${metadataObject.enum}`);
    return metadataObject;
  }
}

function handleScalars(metadataObject: JSONSchema7Definition) {
  if (metadataObject.type) {
    const scalarTypes = [`string`, `number`];
    if (scalarTypes.includes(metadataObject.type.toString())) {
      return metadataObject;
    }
  }
}

function handleOneOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.oneOf) {
    metadataObject.oneOf.map(option => {
      const oneOf = handleSchemaDefinition(option);
      // console.log(oneOf);
    });
  }
}

function handleProperties(metadataObject: JSONSchema7Definition) {
  if (metadataObject.type && metadataObject.type === 'object') {
    if (metadataObject.properties) {
      let md = `\n| Name | Type | Required | Description |\n|-----|-----|-----|-----|\n`;
      for (const [key, value] of Object.entries(metadataObject.properties)) {
        // If there's a ref to another object, we'll call it here
        const propRef = handleSchemaDefinition(value);
        // We'll call a setter function to shape the property's values
        const prop = setPropertyInformation(value, metadataObject, key, propRef);
        md += `| \`${key}\` | ${prop.propType} | ${prop.required} | ${prop.description} |\n`;
      }
      return md;
    }
  }
  return '';
}

function handleRef(metadataObject: JSONSchema7Definition) {
  if (metadataObject.$ref) {
    const ref = metadataObject.$ref;
    const parsedRef = ref.split('/').pop();
    const referencedObject = parentSchema.definitions[parsedRef];
    // This keeps us from dealing with external refs like http...
    if (referencedObject != undefined) {
      const newReference = handleSchemaDefinition(referencedObject);
      return newReference;
      // console.log(newReference);
    } else {
      console.warn(`This is a non-local definition: ${ref}`);
    }
  }
}

function handleAllOf(metadataObject: JSONSchema7Definition) {
  if (metadataObject.allOf) {
    for (const [key, value] of Object.entries(metadataObject.allOf)) {
      const allOf = handleSchemaDefinition(value);
      // console.log(allOf);
    }
  }
}

function handleItems(metadataObject: JSONSchema7Definition) {
  if (metadataObject.items) {
    if (Array.isArray(metadataObject.items)) {
      metadataObject.items.forEach(item => {
        const referencedItem = handleRef(item);
        // console.log(referencedItem);
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
          // console.log(additionalProp);
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
        // console.log(anyOf);
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
  propertyKey: string,
  referencedObject: JSONSchema7
): RefinedProperty {
  let propertyDetails = {
    propName: ``,
    propType: ``,
    required: `No`, // doing this so we can have a default and overwrite it
    description: ``,
  };

  if (property.type) {
    propertyDetails.propType = `\`${property.type.toString()}\``;
  }

  if (property.description) {
    propertyDetails.description = property.description;
  }

  if (referencedObject.description) {
    propertyDetails.description = referencedObject.description;
  }

  if (parentObject.required && parentObject.required.includes(propertyKey)) {
    propertyDetails.required = `Yes`;
  }

  return propertyDetails;
}
