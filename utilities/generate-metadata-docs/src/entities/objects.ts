/**
 * These are our top-level supergraph and subgraph objects from the metadata. They're mapped to their respective pages in /docs/supergraph-modeling.mdx.
 * Our goal is to have them looped over and we can recursively search for a metadata object and any nested structures it uses.
 */
export const openDdObjects = {
  'graphql-config.mdx': ['GraphqlConfig'],
};

export const topLevelSupergraphObjects = {
  'supergraph.mdx': ['CompatibilityConfig', 'AuthConfig'],
};

export const topLevelSubgraphObjects = {
  'types.mdx': ['ObjectTypeV1', 'ScalarTypeV1'],
  'models.mdx': ['ModelV1'],
  'relationships.mdx': ['RelationshipV1'],
  'commands.mdx': ['CommandV1'],
  'permissions.mdx': ['ModelPermissionsV1', 'TypePermissionsV1', 'CommandPermissionsV1'],
  'data-connectors.mdx': ['DataConnectorLinkV1', 'DataConnectorScalarRepresentationV1'],
};
