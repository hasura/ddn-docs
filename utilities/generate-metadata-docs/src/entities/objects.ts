import { JSONSchema7Definition } from './types';
import { readFileSync } from 'fs';

/**
 * These are our top-level objects from the metadata. They're mapped to their respective pages.
 * Our goal is to have them looped over and we can recursively search for a metadata object and any nested structures it uses.
 */

export const parentSchema: JSONSchema7Definition = JSON.parse(readFileSync('./schema.json', 'utf8'));

export const topLevelMetadataObjects: Record<string, string> = {
  CompatibilityConfig: 'supergraph',
  AuthConfig: 'supergraph',
  GraphqlConfig: 'supergraph',
  ScalarType: 'types',
  ObjectType: 'types',
  ObjectBooleanExpressionType: 'types',
  Model: 'models',
  Command: 'commands',
  Relationship: 'relationships',
  TypePermissions: 'permissions',
  ModelPermissions: 'permissions',
  CommandPermissions: 'permissions',
  DataConnectorLink: 'data-connectors',
  DataConnectorScalarRepresentation: 'data-connectors',
  SupergraphManifest: 'build-manifests',
  ConnectorManifest: 'build-manifests',
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
