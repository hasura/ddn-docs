import { JSONSchema7Definition } from './types';
import { readFileSync } from 'fs';

/**
 * These are our top-level objects from the metadata. They're mapped to their respective pages.
 * Our goal is to have them looped over and we can recursively search for a metadata object and any nested structures it uses.
 */

export const parentSchema: JSONSchema7Definition = JSON.parse(readFileSync('./schema.json', 'utf8'));

export const topLevelSupergraphObjects = {
  'supergraph.mdx': ['CompatibilityConfig', 'AuthConfigV1', 'GraphqlConfigV1'],
};

export const topLevelSubgraphObjects = {
  'types.mdx': ['ScalarTypeV1', 'ObjectTypeV1', 'ObjectBooleanExpressionTypeV1'],
  'models.mdx': ['ModelV1'],
  'commands.mdx': ['CommandV1'],
  'relationships.mdx': ['RelationshipV1'],
  'permissions.mdx': ['TypePermissionsV1', 'ModelPermissionsV1', 'CommandPermissionsV1'],
  'data-connectors.mdx': ['DataConnectorLinkV1', 'DataConnectorScalarRepresentationV1'],
};

export const topLevelCliManifestObjects = {
  'build-manifests.mdx': ['SupergraphManifestDefinition', 'ConnectorManifestDefinition'],
};

export const topLevelOpenDDObjects = {
  ...topLevelSupergraphObjects,
  ...topLevelSubgraphObjects,
};

export const topLevelMetadataObjects = {
  ...topLevelOpenDDObjects,
  ...topLevelCliManifestObjects,
};
