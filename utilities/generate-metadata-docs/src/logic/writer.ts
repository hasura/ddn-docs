/**
 * These are our top-level supergraph and subgraph objects from the metadata. They're mapped to their respective pages in /docs/supergraph-modeling.mdx.
 * Our goal is to have them looped over and we can recursively search for a metadata object and any nested structures it uses.
 */
export const topLevelObjects = {
  'model.mdx': ['Model'],
  'relationships.mdx': ['Relationship'],
  'permissions.mdx': ['ModelPermissions', 'TypePermissions', 'CommandPermissions'],
  'commands.mdx': ['Command'],
  'data-connectors.mdx': ['DataConnectorLink', 'DataConnectorScalarRepresentation'],
  'types.mdx': ['ObjectType', 'ScalarType'],
  'graphql-config.mdx': ['GraphqlConfig'],
};
