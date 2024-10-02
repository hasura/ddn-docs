/*
 * TODO:
 * globalIdSource
 * graphql.aggregate
 * graphql.selectMany.deprecated
 * graphql.selectUnique.deprecated
 *
 */
export const modelExample = `---
kind: Model
version: v1
definition:
  name: Users
  objectType: Users
  globalIdSource: false
  arguments: []
  source:
    dataConnectorName: postgres
    collection: users
    argumentMapping: {}
  filterExpressionType: UsersBoolExp
  aggregateExpression: UsersAggregateExp
  orderableFields:
    - fieldName: id
      orderByDirections:
        enableAll: true
    - fieldName: name
      orderByDirections:
        enableAll: true
     ...
  graphql:
    selectMany:
      queryRootField: users
      description: Retrieve multiple users from the Users collection
      deprecated: 
        reason: "Please use ux_Users instead of Users for queries."
    selectUniques:
      - queryRootField: usersById
        uniqueIdentifier:
          - id
        description: Retrieve a user based on the unique identifier, which is the ID
        deprecated: 
          reason: "Please use ux_Users instead of Users for queries."
    orderByExpressionType: UsersOrderBy
    aggregate:
      queryRootField: UsersAggregate
      description: Aggregate over Users
    apolloFederation:
      entitySource: true
  description: The Users model represents a collection of users in the underlying database, providing filtering, sorting, and GraphQL operations.`;
