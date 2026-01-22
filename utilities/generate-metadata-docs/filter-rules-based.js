/**
 * This script removes rules-based authorization content from the HML schema.
 * It filters out:
 * - RulesBased variants from oneOf/anyOf arrays
 * - rulesBased keys from examples and definitions
 * - Examples that become empty/meaningless after filtering (e.g., permissions: {})
 */

const fs = require('fs');

/**
 * Check if an object is empty or contains only empty nested objects
 */
function isEmptyOrMeaningless(obj) {
  if (obj === null || obj === undefined) return true;
  if (typeof obj !== 'object') return false;
  if (Array.isArray(obj)) return obj.length === 0;

  const keys = Object.keys(obj);
  if (keys.length === 0) return true;

  // Check if all values are empty
  return keys.every(key => isEmptyOrMeaningless(obj[key]));
}

/**
 * Check if an example has become meaningless after filtering
 * (e.g., has permissions: {} which indicates it was a rules-based-only example)
 */
function isExampleMeaningless(example) {
  if (!example || typeof example !== 'object') return false;

  // Check if this is a permissions-related example with empty permissions
  if (example.definition && example.definition.permissions) {
    if (isEmptyOrMeaningless(example.definition.permissions)) {
      return true;
    }
  }

  return false;
}

/**
 * Remove rules-based content from the schema
 */
function removeRulesBased(obj, isInExamplesArray = false) {
  if (Array.isArray(obj)) {
    return obj
      .filter(item => {
        // Remove objects that are RulesBased variants in oneOf/anyOf
        if (item && typeof item === 'object') {
          if (item.title === 'RulesBased') return false;
          if (item.required && Array.isArray(item.required) && item.required.includes('rulesBased')) return false;
        }
        return true;
      })
      .map(item => removeRulesBased(item, isInExamplesArray))
      .filter(item => {
        // After processing, remove meaningless examples
        if (isInExamplesArray && isExampleMeaningless(item)) {
          return false;
        }
        return true;
      });
  }

  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip rulesBased keys in examples and definitions
      if (key === 'rulesBased') continue;

      // Track if we're entering an examples array
      const enteringExamples = key === 'examples' && Array.isArray(value);
      result[key] = removeRulesBased(value, enteringExamples);
    }
    return result;
  }

  return obj;
}

const schemaPath = './hml_schema_resolved.json';

try {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const filtered = removeRulesBased(schema, false);
  fs.writeFileSync(schemaPath, JSON.stringify(filtered, null, 2));
  console.log('✅ Rules-based authorization removed from hml_schema_resolved.json');
} catch (error) {
  console.error('❌ Failed to filter schema:', error.message);
  process.exit(1);
}
