import { readFileSync } from 'fs';

import { JSONSchema7Definition } from './types';

/**
 * These are our top-level objects from the metadata. They're mapped to their
 * respective pages. Our goal is to have them looped over and we can recursively
 * search for a metadata object and any nested structures it uses.
 */

export const parentSchema: JSONSchema7Definition = JSON.parse(readFileSync('./schema.json', 'utf8'));

export const topLevelMetadataObjects: Record<string, string> = {
  v2_CompatibilityConfig: 'compatibility-config',
  AuthConfig: 'auth-config',
  GraphqlConfig: 'graphql-config',
  ScalarType: 'types',
  ObjectType: 'types',
  BooleanExpressionType: 'types',
  ObjectBooleanExpressionType: 'types',
  Model: 'models',
  Command: 'commands',
  Relationship: 'relationships',
  TypePermissions: 'permissions',
  ModelPermissions: 'permissions',
  CommandPermissions: 'permissions',
  DataConnectorLink: 'data-connector-links',
  DataConnectorScalarRepresentation: 'data-connector-links',
  Supergraph: 'build-configs',
  Subgraph: 'build-configs',
  Connector: 'build-configs',
};

export const topLevelMetadataRefs: Record<string, string> = {};
for (const [metadataObject, file] of Object.entries(topLevelMetadataObjects)) {
  topLevelMetadataRefs[metadataObject] = `[${metadataObject}](${`${file}#${metadataObject}`.toLowerCase()})`;
}

export const fileToObjectsMapping: Record<string, string[]> = {};
for (const [metadataObject, file] of Object.entries(topLevelMetadataObjects)) {
  if (!fileToObjectsMapping[file]) {
    fileToObjectsMapping[file] = [];
  }

  fileToObjectsMapping[file].push(metadataObject);
}

export const externalMetadataRefs: Record<string, string> = {
  'Schema Response': '[Schema Response](https://hasura.github.io/ndc-spec/specification/schema/index.html)',
  'Capabilities Response': '[Capabilities Response](https://hasura.github.io/ndc-spec/specification/capabilities.html)',
};
