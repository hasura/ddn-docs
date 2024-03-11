import { readFileSync } from 'fs';
import { JSONSchema7 } from '../entities';
import { removeNewLineCharacter } from './helpers';
import jsYaml from 'js-yaml';

const parentSchema: JSONSchema7 = JSON.parse(readFileSync('./schema.json', 'utf8'));

// Unique identifier for each object based on title
type UniqueIdentifier = string;

function generateObjectMarkdown(object: JSONSchema7): [string, Array<[UniqueIdentifier, JSONSchema7]>] {
  // We'll create a placeholder for the array's return value and the markdown we intend to nest
  let subObjectsToProcess: Array<[UniqueIdentifier, JSONSchema7]> = [];
  let markdown = '';

  // Deal with pruning the V1 suffixes on various objects
  if (object.title) {
    if (!object.title.includes(`V1`)) {
      markdown += `\n\n#### ${object.title}\n\n`;
      if (object.description) {
        markdown += `${object.description}\n\n`;
      }
    }
  }

  if (object.oneOf) {
    markdown += `\n\n**This object must have exactly one of the following:**\n\n| Name | Type | Required | Description |\n| ----- | ----- | ----- | ----- |\n`;
    object.oneOf.map(subObject => {
      // If there's top-level information available, we'll grab it.
      let propType = `\`${subObject.type.toString()}\``;
      let propName = subObject.title ? subObject.title : subObject.required;
      if (subObject.enum) {
        propName = subObject.enum[0].toString();
      }
      let required = `No`;
      let propDescription = subObject.description ? subObject.description : ``;

      // Otherwise, we need to unpack the properties
      if (subObject.properties) {
        for (const [key, value] of Object.entries(subObject.properties)) {
          if (value.type) {
            propType = `\`${value.type.toString()}\``;
          } else if (value.$ref) {
            const uniqueIdentifier = value.$ref.split('/').pop();
            const referencedObject = parentSchema.definitions[uniqueIdentifier];
            subObjectsToProcess.push([uniqueIdentifier, referencedObject]);
            if (referencedObject && referencedObject.type) {
              propType = `\`${referencedObject.type}\``;
            }
            if (referencedObject && referencedObject.description) {
              propDescription = referencedObject.description;
            }
          } else {
            const uniqueIdentifier = value.toString();
            const referencedObject = parentSchema.definitions[uniqueIdentifier];
            subObjectsToProcess.push([uniqueIdentifier, referencedObject]);
          }
        }
      }
      markdown += `| \`${propName}\` | ${propType} | ${required} | ${propDescription} |\n`;
    });
  }

  if (object.properties) {
    // Start with the header
    markdown += `\n\n**Properties**\n\n| Name | Type | Required | Description |\n| ----- | ----- | ----- | ----- |\n`;

    // We'll se the basic information for the property in the table
    for (const [key, value] of Object.entries(object.properties)) {
      const propName = key;
      let propType = value.type ? `\`${value.type}\`` : `booboo`;
      let propDescription = value.description ? value.description : '';
      let required = object.required ? object.required.includes(key) : 'N/A';

      // If the type is simple, we can grab it. Otherwise, we need to get the type of the ref
      if (value.type == 'string' || value.type == 'boolean' || value.type == 'number') {
        propType = `\`${value.type}\``;
      }

      if (value.type === 'array') {
        const uniqueIdentifier = Array.isArray(value.items)
          ? value.items[0].$ref.split('/').pop()
          : value.items.$ref.split('/').pop();
        const referencedObject = parentSchema.definitions[uniqueIdentifier];
        subObjectsToProcess.push([uniqueIdentifier, referencedObject]);
        const propRef = uniqueIdentifier.toLowerCase();
        propType = `[\`array\`](#${propRef})`;
        if (value.description) {
          propDescription = value.description;
        }
      }

      if (value.allOf) {
        const uniqueIdentifier = value.allOf[0].$ref.split('/').pop();
        const referencedObject = parentSchema.definitions[uniqueIdentifier];
        if (referencedObject.type) {
          const propRef = uniqueIdentifier.toLowerCase();
          const simplifiedType = referencedObject.type.toString();
          if (simplifiedType === 'string') {
            propType = `\`string\``;
          } else {
            propType = `[\`${simplifiedType}\`](#${propRef})`;
          }
        } else if (referencedObject.title) {
          const uniqueIdentifier = referencedObject.title;
          subObjectsToProcess.push([uniqueIdentifier, referencedObject]);
          propType = `[\`object\`](#${uniqueIdentifier.toLowerCase()})`;
        } else {
          // This will be an anyOf
          referencedObject.anyOf.map(subObject => {
            if (subObject.$ref != null) {
              const uniqueIdentifier = subObject.$ref.split('/').pop();
              const referencedObject = parentSchema.definitions[uniqueIdentifier];
              propType = referencedObject.type ? `\`${referencedObject.type.toString()}\`` : `\`object\``;
              subObjectsToProcess.push([uniqueIdentifier, referencedObject]);
            }
          });
        }
      }

      if (value.anyOf) {
        const uniqueIdentifier = value.anyOf[0].$ref.split('/').pop();
        const referencedObject = parentSchema.definitions[uniqueIdentifier];
        subObjectsToProcess.push([uniqueIdentifier, referencedObject]);
        if (referencedObject.type) {
          // we'll create an anchor tag to the type's location on the page
          const propRef = uniqueIdentifier.toLowerCase();
          const simplifiedType = referencedObject.type.toString();
          if (simplifiedType === 'string') {
            propType = `\`string\``;
          } else {
            propType = `[\`${simplifiedType}\`](#${propRef})`;
          }
        } else {
          propType = `[\`object\`](#${uniqueIdentifier.toLowerCase()})`;
        }
      }

      if (value.$ref) {
        const uniqueIdentifier = value.$ref.split('/').pop();
        const referencedObject = parentSchema.definitions[uniqueIdentifier];
        subObjectsToProcess.push([uniqueIdentifier, referencedObject]);
        if (referencedObject.description != undefined) {
          propDescription = referencedObject.description;
        }
        if (referencedObject.type != undefined) {
          propType = `\`${referencedObject.type.toString()}\``;
        } else {
          propType = `\`object\``;
        }
      }

      if (value.additionalProperties && value.additionalProperties.$ref) {
        // TODO: Add key before unpacking additionalProperties
        // TODO: Deal with array and objects not using "actual" name
        const uniqueIdentifier = value.additionalProperties.$ref.split('/').pop();
        const referencedObject = parentSchema.definitions[uniqueIdentifier];
        subObjectsToProcess.push([uniqueIdentifier, referencedObject]);
        propType = `[\`${propType}\`](#${uniqueIdentifier.toLowerCase()})`;
      }

      if (value.description) {
        propDescription = value.description;
      }

      if (value.type === 'object') {
        if (value.description) {
          propDescription = value.description;
        }
      }

      // Deal with string,null instances of propType
      if (propType.includes(`null`)) {
        propType = `\`string\``;
      }

      markdown += `| \`${propName}\` | ${propType} | ${required ? `Yes` : `No`} | ${removeNewLineCharacter(
        propDescription
      )} |\n`;
    }
  }

  if (object.enum) {
    markdown += `This can be one of the following:\n\n`;
    let options: string[] = [];
    object.enum.map(enumOption => {
      options.push(enumOption.toString());
    });
    markdown += `<div><pre><code>${options.join(' | ')}</code></pre></div>`;
  }

  if (object.examples) {
    markdown += `\n\n**Example:**\n\n\`\`\`yaml\n${jsYaml.dump(object.examples[0])}\n\`\`\`\n`;
  }
  // return the map of unique identifier to jsonschema openDdObjects
  return [markdown, subObjectsToProcess];
}

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
export function generateMarkdownForTopLevelMetadataKind(object: JSONSchema7): string | void {
  // If, for some reason, we pass the wrong object here, early return
  if (!object.oneOf) {
    return;
  }

  // We can start our markdown
  let md = `### ${object.title}\n\n${object.description ? object.description : ''}`;

  // If we pass the correct object here, it will have a oneOf that are our top-level objects
  let metadataObject = object.oneOf[0];
  /**
   * Then, we'll create a tuple to determine which sub-objects for which we need to generate
   * markdown, and a Set for storing those for which we've already generated markdown
   */
  let objectsToGenerate: Array<[string, JSONSchema7]> = [['', metadataObject.properties.definition]];
  let generatedObjects = new Set<string>();

  /**
   * So long as there are sub-objects for which to generate markdown, we need this loop to continue
   */
  while (objectsToGenerate.length != 0) {
    let object = objectsToGenerate.shift();
    /**
     * If we run into an object for which we've already generated markdown, skip it.
     * Otherwise, add it to the generatedObjects set and let's call generateObjectMarkdown
     * give us the tables, etc. markdown and any subObjects that are referenced in the object
     */
    if (generatedObjects.has(object[0])) {
      continue;
    }

    generatedObjects.add(object[0]);

    if (object[0].includes('.') || object[0].includes('true')) {
    } else {
      if (object[1] && object[1].$ref) {
        const uniqueIdentifier = object[1].$ref;
        const referencedObject = parentSchema.definitions[uniqueIdentifier.split('/').pop()];
        let subObject: [UniqueIdentifier, JSONSchema7] = [uniqueIdentifier, referencedObject];
        objectsToGenerate.push(subObject);
      }

      // From the object — which is an array — we grab the metadata object and pass it on
      let [subMarkdown, subObjects] = generateObjectMarkdown(object[1]);
      /**
       * Add the additional markdown to the parent object's markdown and populate the objectsToGenerate
       * array if necessary
       */
      md += subMarkdown;
      objectsToGenerate.push(...subObjects);
    }
  }
  return md;
}
