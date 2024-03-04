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
  'types.mdx': ['ObjectType', 'ScalarType'],
  'models.mdx': ['Model'],
  'relationships.mdx': ['Relationship'],
  'commands.mdx': ['Command'],
  'permissions.mdx': ['ModelPermissions', 'TypePermissions', 'CommandPermissions'],
  'data-connectors.mdx': ['DataConnectorLink', 'DataConnectorScalarRepresentation'],
};
