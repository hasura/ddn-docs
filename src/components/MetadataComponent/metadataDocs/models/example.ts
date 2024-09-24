export const example = `---
kind: Model
version: v1
definition:
  name: Users
  objectType: Users
  source:
    dataConnectorName: my_pg
    collection: users
  filterExpressionType: UsersBoolExp
  orderableFields:
    - fieldName: id
      orderByDirections:
        enableAll: true
    - fieldName: name
      orderByDirections:
        enableAll: true
    - fieldName: email
      orderByDirections:
        enableAll: true
    - fieldName: createdAt
      orderByDirections:
        enableAll: true
  graphql:
    selectMany:
      queryRootField: users
    selectUniques:
      - queryRootField: usersById
        uniqueIdentifier:
          - id
    orderByExpressionType: UsersOrderBy`;
