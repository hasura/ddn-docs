
> generate-metadata-docs@1.0.0 start
> npx ts-node src/index.ts


### CommandPermissions

Definition of permissions for an OpenDD command.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [CommandPermissionsV1](#commandpermissionsv1) | true |  |



### CommandPermissionsV1

Definition of permissions for an OpenDD command.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `commandName` | string | true | The name of the command for which permissions are being defined. |
| `permissions` | [[CommandPermission](#commandpermission)] | true | A list of command permissions, one for each role. |

 #### Example

```yaml
commandName: get_article_by_id
permissions:
  - role: admin
    allowExecution: true
  - role: user
    allowExecution: true
```


### CommandPermission

Defines the permissions for a role for a command.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `role` | string | true | The role for which permissions are being defined. |
| `allowExecution` | boolean | true | Whether the command is executable by the role. |

 #### Example

```yaml
role: user
allowExecution: true
```


### ModelPermissions

Definition of permissions for an OpenDD model.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [ModelPermissionsV1](#modelpermissionsv1) | true |  |



### ModelPermissionsV1

Definition of permissions for an OpenDD model.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `modelName` | string | true | The name of the model for which permissions are being defined. |
| `permissions` | [[ModelPermission](#modelpermission)] | true | A list of model permissions, one for each role. |

 #### Example

```yaml
modelName: Articles
permissions:
  - role: admin
    select:
      filter: null
  - role: user
    select:
      filter:
        fieldComparison:
          field: author_id
          operator: _eq
          value:
            sessionVariable: x-hasura-user-id
```


### ModelPermission

Defines the permissions for an OpenDD model.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `role` | string | true | The role for which permissions are being defined. |
| `select` | [SelectPermission](#selectpermission) / null | false | The permissions for selecting from this model for this role. If this is null, the role is not allowed to query the model. |

 #### Example

```yaml
role: user
select:
  filter:
    fieldComparison:
      field: author_id
      operator: _eq
      value:
        sessionVariable: x-hasura-user-id
```


### SelectPermission

Defines the permissions for selecting a model for a role.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `filter` | null / [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) / [And](#and) / [Or](#or) / [Not](#not) | true | Filter expression when selecting rows for this model. Null filter implies all rows are selectable. |



### Not

Evaluates to true if the sub-predicate evaluates to false.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `not` | [ModelPredicate](#modelpredicate) | true |  |



### Or

Evaluates to true if any of the sub-predicates evaluate to true.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `or` | [[ModelPredicate](#modelpredicate)] | true |  |



### And

Evaluates to true if all sub-predicates evaluate to true.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `and` | [[ModelPredicate](#modelpredicate)] | true |  |



### undefined

Filters objects based on the relationship of a model.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `relationship` | [RelationshipPredicate](#relationshippredicate) | true |  |



### RelationshipPredicate

Relationship predicate filters objects of a source model based on a predicate on the related model.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the relationship of the object type of the model to follow. |
| `predicate` | [ModelPredicate](#modelpredicate) / null | false | The predicate to apply on the related objects. If this is null, then the predicate evaluates to true as long as there is at least one related object present. |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldIsNull` | [undefined](#undefined) | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `field` | string | true |  |



### undefined

Filters objects based on a field value.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldComparison` | [FieldComparisonPredicate](#fieldcomparisonpredicate) | true |  |



### FieldComparisonPredicate

Field comparision predicate filters objects based on a field value.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `field` | string | true | The field name of the object type of the model to compare. |
| `operator` | string | true | The name of the operator to use for comparison. |
| `value` | [Literal](#literal) / [SessionVariable](#sessionvariable) | true | The value expression to compare against. |



### TypePermissions

Definition of permissions for an OpenDD type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [TypePermissionsV1](#typepermissionsv1) | true |  |



### TypePermissionsV1

Definition of permissions for an OpenDD type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `typeName` | string | true | The name of the type for which permissions are being defined. Must be an object type. |
| `permissions` | [[TypePermission](#typepermission)] | true | A list of type permissions, one for each role. |

 #### Example

```yaml
typeName: article
permissions:
  - role: admin
    output:
      allowedFields:
        - article_id
        - author_id
        - title
  - role: user
    output:
      allowedFields:
        - article_id
        - author_id
```


### TypePermission

Defines permissions for a particular role for a type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `role` | string | true | The role for which permissions are being defined. |
| `output` | [TypeOutputPermission](#typeoutputpermission) / null | false | Permissions for this role when this type is used in an output context. If null, this type is inaccessible for this role in an output context. |

 #### Example

```yaml
role: user
output:
  allowedFields:
    - article_id
    - author_id
```


### TypeOutputPermission

Permissions for a type for a particular role when used in an output context.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `allowedFields` | [string] | true | Fields of the type that are accessible for a role |



### Relationship

Definition of a relationship on an OpenDD type which allows it to be extended with related models or commands.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [RelationshipV1](#relationshipv1) | true |  |



### RelationshipV1

Definition of a relationship on an OpenDD type which allows it to be extended with related models or commands.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the relationship. |
| `source` | string | true | The source type of the relationship. |
| `target` | [undefined](#undefined) / [undefined](#undefined) | true | The target of the relationship. |
| `mapping` | [[RelationshipMapping](#relationshipmapping)] | true | The mapping configuration of source to target for the relationship. |
| `description` | string | false | The description of the relationship. Gets added to the description of the relationship in the graphql schema. |

 #### Example

```yaml
name: Articles
source: author
target:
  model:
    name: Articles
    namespace: null
    subgraph: null
    relationshipType: Array
mapping:
  - source:
      fieldPath:
        - fieldName: author_id
    target:
      modelField:
        - fieldName: author_id
description: Articles written by an author
```


### RelationshipMapping

Definition of a how a particular field in the source maps to a target field or argument.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `source` | [SourceValue](#sourcevalue) / [SourceField](#sourcefield) | true | The source configuration for this relationship mapping. |
| `target` | [TargetArgument](#targetargument) / [TargetModelField](#targetmodelfield) | true | The target configuration for this relationship mapping. |

 #### Example

```yaml
source:
  fieldPath:
    - fieldName: author_id
target:
  modelField:
    - fieldName: author_id
```


### TargetModelField

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `modelField` | [[RelationshipSourceFieldAccess](#relationshipsourcefieldaccess)] | true |  |



### TargetArgument

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `argument` | [ArgumentMappingTarget](#argumentmappingtarget) | true |  |



### ArgumentMappingTarget

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `argumentName` | string | true |  |



### SourceField

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldPath` | [[RelationshipSourceFieldAccess](#relationshipsourcefieldaccess)] | true |  |



### RelationshipSourceFieldAccess

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldName` | string | true |  |



### SourceValue

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `value` | [Literal](#literal) / [SessionVariable](#sessionvariable) | true |  |



### SessionVariable

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `sessionVariable` | string | true |  |



### Literal

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `literal` |  | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `command` | [CommandRelationshipTarget](#commandrelationshiptarget) | true |  |



### CommandRelationshipTarget

The target command for a relationship.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the command. |
| `subgraph` | string | false | The subgraph of the target command. Defaults to the current subgraph. |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `model` | [ModelRelationshipTarget](#modelrelationshiptarget) | true |  |



### ModelRelationshipTarget

The target model for a relationship.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the data model. |
| `namespace` | string | false |  |
| `subgraph` | string | false | The subgraph of the target model. Defaults to the current subgraph. |
| `relationshipType` | string / string | true | Type of the relationship - object or array. |



### Command

The definition of a command. A command is a user-defined operation which can take arguments and returns an output. The semantics of a command are opaque to the Open DD specification.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [CommandV1](#commandv1) | true |  |



### CommandV1

Definition of an OpenDD Command, which is a custom operation that can take arguments and returns an output. The semantics of a command are opaque to OpenDD.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the command. |
| `outputType` | string | true | The return type of the command. |
| `arguments` | [[ArgumentDefinition](#argumentdefinition)] | false | The list of arguments accepted by this command. Defaults to no arguments. |
| `source` | [CommandSource](#commandsource) / null | false | The source configuration for this command. |
| `graphql` | [CommandGraphQlDefinition](#commandgraphqldefinition) / null | false | Configuration for how this command should appear in the GraphQL schema. |
| `description` | string | false | The description of the command. Gets added to the description of the command's root field in the graphql schema. |

 #### Example

```yaml
name: get_latest_article
outputType: commandArticle
arguments: []
source:
  dataConnectorName: data_connector
  dataConnectorCommand:
    function: latest_article
  argumentMapping: {}
graphql:
  rootFieldName: getLatestArticle
  rootFieldKind: Query
description: Get the latest article
```


### CommandGraphQlDefinition

The definition of how a command should appear in the GraphQL API.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `rootFieldName` | string | true | The name of the graphql root field to use for this command. |
| `rootFieldKind` | string | true | Whether to put this command in the Query or Mutation root of the GraphQL API. |

 #### Example

```yaml
rootFieldName: getLatestArticle
rootFieldKind: Query
```


### CommandSource

Description of how a command maps to a particular data connector

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `dataConnectorName` | string | true | The name of the data connector backing this command. |
| `dataConnectorCommand` | [Function](#function) / [Procedure](#procedure) | true | The function/procedure in the data connector that backs this command. |
| `argumentMapping` | [undefined](#undefined) | false | Mapping from command argument names to data connector table argument names. |

 #### Example

```yaml
dataConnectorName: data_connector
dataConnectorCommand:
  function: latest_article
argumentMapping: {}
```


### undefined

Mapping from command argument names to data connector table argument names.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | string | No |  |



### Procedure

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `procedure` | string | true |  |



### Function

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `function` | string | true |  |



### Model

The definition of a data model. A data model is a collection of objects of a particular type. Models can support one or more CRUD operations.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [ModelV1](#modelv1) | true |  |



### ModelV1

The definition of a data model. A data model is a collection of objects of a particular type. Models can support one or more CRUD operations.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the data model. |
| `objectType` | string | true | The type of the objects of which this model is a collection. |
| `globalIdSource` | boolean | false | Whether this model should be used as the global ID source for all objects of its type. |
| `arguments` | [[ArgumentDefinition](#argumentdefinition)] | false | A list of arguments accepted by this model. Defaults to no arguments. |
| `source` | [ModelSource](#modelsource) / null | false | The source configuration for this model. |
| `filterExpressionType` | string / null | false | The boolean expression type that should be used to perform filtering on this model. |
| `orderableFields` | [[OrderableField](#orderablefield)] | true | A list of fields that can be used to order the objects in this model. |
| `graphql` | [ModelGraphQlDefinition](#modelgraphqldefinition) / null | false | Configuration for how this model should appear in the GraphQL schema. |
| `description` | string | false | The description of the model. Gets added to the description of the model in the graphql schema. |

 #### Example

```yaml
name: Articles
objectType: article
globalIdSource: true
arguments: []
source:
  dataConnectorName: data_connector
  collection: articles
  argumentMapping: {}
filterExpressionType: Article_bool_exp
orderableFields:
  - fieldName: article_id
    orderByDirections:
      enableAll: true
  - fieldName: title
    orderByDirections:
      enableAll: true
  - fieldName: author_id
    orderByDirections:
      enableAll: true
graphql:
  selectUniques:
    - queryRootField: ArticleByID
      uniqueIdentifier:
        - article_id
      description: Description for the select unique ArticleByID
  selectMany:
    queryRootField: ArticleMany
    description: Description for the select many ArticleMany
  orderByExpressionType: Article_Order_By
description: Description for the model Articles
```


### ModelGraphQlDefinition

The definition of how a model appears in the GraphQL API.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `selectUniques` | [[SelectUniqueGraphQlDefinition](#selectuniquegraphqldefinition)] | true | For each select unique defined here, a query root field is added to the GraphQL API that can be used to select a unique object from the model. |
| `selectMany` | [SelectManyGraphQlDefinition](#selectmanygraphqldefinition) / null | false | Select many configuration for a model adds a query root field to the GraphQl API that can be used to retrieve multiple objects from the model. |
| `argumentsInputType` | string / null | false | The type name of the input type used to hold the arguments of the model. |
| `orderByExpressionType` | string / null | false | The type name of the order by expression input type. |

 #### Example

```yaml
selectUniques:
  - queryRootField: ArticleByID
    uniqueIdentifier:
      - article_id
    description: Description for the select unique ArticleByID
selectMany:
  queryRootField: ArticleMany
  description: Description for the select many ArticleMany
orderByExpressionType: Article_Order_By
```


### SelectManyGraphQlDefinition

The definition of the GraphQL API for selecting rows from a model.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `queryRootField` | string | true | The name of the query root field for this API. |
| `description` | string | false | The description of the select many graphql definition of the model. Gets added to the description of the select many root field of the model in the graphql schema. |



### SelectUniqueGraphQlDefinition

The definition of the GraphQL API for selecting a unique row/object from a model.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `queryRootField` | string | true | The name of the query root field for this API. |
| `uniqueIdentifier` | [string] | true | A set of fields which can uniquely identify a row/object in the model. |
| `description` | string | false | The description of the select unique graphql definition of the model. Gets added to the description of the select unique root field of the model in the graphql schema. |



### OrderableField

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldName` | string | true |  |
| `orderByDirections` | [undefined](#undefined) / [undefined](#undefined) | true |  |



### ModelSource

Description of how a model maps to a particular data connector

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `dataConnectorName` | string | true | The name of the data connector backing this model. |
| `collection` | string | true | The collection in the data connector that backs this model. |
| `argumentMapping` | [undefined](#undefined) | false |  |

 #### Example

```yaml
dataConnectorName: data_connector
collection: articles
```


### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | string | No |  |



### ArgumentDefinition

The definition of an argument for a field, command, or model.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true |  |
| `type` | string | true |  |
| `description` | string | false |  |



### DataConnectorScalarRepresentation

The representation of a data connector scalar in terms of Open DD types

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [DataConnectorScalarRepresentationV1](#dataconnectorscalarrepresentationv1) | true |  |



### DataConnectorScalarRepresentationV1

The representation of a data connector scalar in terms of Open DD types

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `dataConnectorName` | string | true | The name of the data connector that this scalar type comes from. |
| `dataConnectorScalarType` | string | true | The name of the scalar type coming from the data connector. |
| `representation` | string / string | true | The name of the Open DD type that this data connector scalar type should be represented as. |
| `graphql` | [DataConnectorScalarGraphQLConfiguration](#dataconnectorscalargraphqlconfiguration) / null | false | Configuration for how this scalar's operators should appear in the GraphQL schema. |

 #### Example

```yaml
dataConnectorName: data_connector
dataConnectorScalarType: varchar
representation: String
graphql:
  comparisonExpressionTypeName: String_Comparison_Exp
```


### DataConnectorScalarGraphQLConfiguration

GraphQL configuration of a data connector scalar

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `comparisonExpressionTypeName` | string / null | undefined |  |



### ObjectBooleanExpressionType

Definition of a type representing a boolean expression on an Open DD object type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [ObjectBooleanExpressionTypeV1](#objectbooleanexpressiontypev1) | true |  |



### ObjectBooleanExpressionTypeV1

Definition of a type representing a boolean expression on an Open DD object type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name to give this object boolean expression type, used to refer to it elsewhere in the metadata. Must be unique across all types defined in this subgraph. |
| `objectType` | string | true | The name of the object type that this boolean expression applies to. |
| `dataConnectorName` | string | true | The data connector this boolean expression type is based on. |
| `dataConnectorObjectType` | string | true | The object type in the data connector's schema this boolean expression type is based on. |
| `comparableFields` | [[ComparableField](#comparablefield)] | true | The list of fields of the object type that can be used for comparison when evaluating this boolean expression. |
| `graphql` | [ObjectBooleanExpressionTypeGraphQlConfiguration](#objectbooleanexpressiontypegraphqlconfiguration) / null | false | Configuration for how this object type should appear in the GraphQL schema. |

 #### Example

```yaml
name: AuthorBoolExp
objectType: Author
dataConnectorName: my_db
dataConnectorObjectType: author
comparableFields:
  - fieldName: article_id
    operators:
      enableAll: true
  - fieldName: title
    operators:
      enableAll: true
  - fieldName: author_id
    operators:
      enableAll: true
graphql:
  typeName: Author_bool_exp
```


### ObjectBooleanExpressionTypeGraphQlConfiguration

GraphQL configuration of an Open DD boolean expression type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `typeName` | string | true | The name to use for the GraphQL type representation of this boolean expression type. |



### ComparableField

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldName` | string | true |  |
| `operators` | [undefined](#undefined) / [undefined](#undefined) | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `enableSpecific` | [string] | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `enableAll` | boolean | true |  |



### ScalarType

Definition of a user-defined scalar type that that has opaque semantics.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [ScalarTypeV1](#scalartypev1) | true |  |



### ScalarTypeV1

Definition of a user-defined scalar type that that has opaque semantics.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name to give this scalar type, used to refer to it elsewhere in the metadata. Must be unique across all types defined in this subgraph. |
| `graphql` | [ScalarTypeGraphQLConfiguration](#scalartypegraphqlconfiguration) / null | false | Configuration for how this scalar type should appear in the GraphQL schema. |
| `description` | string | false | The description of this scalar. Gets added to the description of the scalar's definition in the graphql schema. |

 #### Example

```yaml
name: CustomString
graphql:
  typeName: CustomString
description: A custom string type
```


### ScalarTypeGraphQLConfiguration

GraphQL configuration of an Open DD scalar type

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `typeName` | string | true | The name of the GraphQl type to use for this scalar. |



### ObjectType

Definition of a user-defined Open DD object type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [ObjectTypeV1](#objecttypev1) | true |  |



### ObjectTypeV1

Definition of a user-defined Open DD object type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name to give this object type, used to refer to it elsewhere in the metadata. Must be unique across all types defined in this subgraph. |
| `fields` | [[ObjectFieldDefinition](#objectfielddefinition)] | true | The list of fields defined for this object type. |
| `globalIdFields` | [string] | false | The subset of fields that uniquely identify this object in the domain. Setting this property will automatically implement the GraphQL Relay Node interface for this object type and add an `id` global ID field. If setting this property, there must not be a field named `id` already present. |
| `graphql` | [ObjectTypeGraphQLConfiguration](#objecttypegraphqlconfiguration) / null | false | Configuration for how this object type should appear in the GraphQL schema. |
| `description` | string | false | The description of the object. Gets added to the description of the object's definition in the graphql schema. |
| `dataConnectorTypeMapping` | [[DataConnectorTypeMapping](#dataconnectortypemapping)] | false | Mapping of this object type to corresponding object types in various data connectors. |

 #### Example

```yaml
name: Author
fields:
  - name: author_id
    type: Int!
    description: The id of the author
  - name: first_name
    type: String
    description: The first name of the author
  - name: last_name
    type: String
    description: The last name of the author
description: An author of a book
globalIdFields:
  - author_id
graphql:
  typeName: Author
dataConnectorTypeMapping:
  - dataConnectorName: my_db
    dataConnectorObjectType: author
    fieldMapping:
      author_id:
        column:
          name: id
```


### DataConnectorTypeMapping

This defines the mapping of the fields of an object type to the corresponding columns of an object type in a data connector.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `dataConnectorName` | string | true |  |
| `dataConnectorObjectType` | string | true |  |
| `fieldMapping` | [undefined](#undefined) | false |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [undefined](#undefined) | No |  |



### undefined

Source field directly maps to some column in the data connector.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `column` | [ColumnFieldMapping](#columnfieldmapping) | true |  |



### ColumnFieldMapping

The target column in a data connector object that a source field maps to.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the target column |



### ObjectTypeGraphQLConfiguration

GraphQL configuration of an Open DD object type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `typeName` | string / null | undefined | The name to use for the GraphQL type representation of this object type when used in an output context. |
| `inputTypeName` | string / null | undefined | The name to use for the GraphQL type representation of this object type when used in an input context. |



### ObjectFieldDefinition

The definition of a field in a user-defined object type.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the field. This name is used both when referring to the field elsewhere in the metadata and when creating the corresponding GraphQl type. |
| `type` | string | true | The type of this field. This uses the GraphQL syntax to represent field types and must refer to one of the inbuilt OpenDd types or another user-defined type. |
| `description` | string | false | The description of this field. Gets added to the description of the field's definition in the graphql schema. |



### DataConnectorLink

Definition of a data connector, used to bring in sources of data and connect them to OpenDD models and commands.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [DataConnectorLinkV1](#dataconnectorlinkv1) | true |  |



### DataConnectorLinkV1

Definition of a data connector - version 1.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the data connector. |
| `url` | [undefined](#undefined) / [undefined](#undefined) | true | The url(s) to access the data connector. |
| `headers` | [undefined](#undefined) | false | Key value map of HTTP headers to be sent with each request to the data connector. |
| `schema` | [SchemaAndCapabilitiesV01](#schemaandcapabilitiesv01) | true | The schema of the data connector. This schema is used as the source of truth when serving requests and the live schema of the data connector is not looked up. |

 #### Example

```yaml
name: data_connector
url:
  singleUrl:
    value: http://data_connector:8100
headers: {}
schema:
  version: v0.1
  schema:
    scalar_types: {}
    object_types: {}
    collections: []
    functions: []
    procedures: []
  capabilities:
    version: 0.1.0
    capabilities:
      query:
        variables: {}
      mutation: {}
```


### SchemaAndCapabilitiesV01

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `version` | string | true |  |
| `schema` | [Schema Response](#schema-response) | true |  |
| `capabilities` | [Capabilities Response](#capabilities-response) | true |  |



### Capabilities Response

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `version` | string | true |  |
| `capabilities` | [Capabilities](#capabilities) | true |  |



### Capabilities

Describes the features of the specification which a data connector implements.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `query` | [Query Capabilities](#query-capabilities) | true |  |
| `mutation` | [Mutation Capabilities](#mutation-capabilities) | true |  |
| `relationships` | [Relationship Capabilities](#relationship-capabilities) / null | false |  |



### Relationship Capabilities

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `relation_comparisons` | [LeafCapability](#leafcapability) / null | undefined | Does the connector support comparisons that involve related collections (ie. joins)? |
| `order_by_aggregate` | [LeafCapability](#leafcapability) / null | undefined | Does the connector support ordering by an aggregated array relationship? |



### Mutation Capabilities

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `transactional` | [LeafCapability](#leafcapability) / null | undefined | Does the connector support executing multiple mutations in a transaction. |
| `explain` | [LeafCapability](#leafcapability) / null | undefined | Does the connector support explaining mutations |



### Query Capabilities

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `aggregates` | [LeafCapability](#leafcapability) / null | undefined | Does the connector support aggregate queries |
| `variables` | [LeafCapability](#leafcapability) / null | undefined | Does the connector support queries which use variables |
| `explain` | [LeafCapability](#leafcapability) / null | undefined | Does the connector support explaining queries |



### LeafCapability

A unit value to indicate a particular leaf capability is supported. This is an empty struct to allow for future sub-capabilities.

| Name | Type | Required | Description |
|-----|-----|-----|-----|



### Schema Response

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `scalar_types` | [undefined](#undefined) | true | A list of scalar types which will be used as the types of collection columns |
| `object_types` | [undefined](#undefined) | true | A list of object types which can be used as the types of arguments, or return types of procedures. Names should not overlap with scalar type names. |
| `collections` | [[Collection Info](#collection-info)] | true | Collections which are available for queries |
| `functions` | [[Function Info](#function-info)] | true | Functions (i.e. collections which return a single column and row) |
| `procedures` | [[Procedure Info](#procedure-info)] | true | Procedures which are available for execution as part of mutations |



### Procedure Info

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the procedure |
| `description` | string | false | Column description |
| `arguments` | [undefined](#undefined) | true | Any arguments that this collection requires |
| `result_type` | [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) | true | The name of the result type |



### undefined

Any arguments that this collection requires

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Argument Info](#argument-info) | No |  |



### Function Info

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the function |
| `description` | string | false | Description of the function |
| `arguments` | [undefined](#undefined) | true | Any arguments that this collection requires |
| `result_type` | [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) | true | The name of the function's result type |



### undefined

Any arguments that this collection requires

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Argument Info](#argument-info) | No |  |



### Collection Info

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `name` | string | true | The name of the collection

Note: these names are abstract - there is no requirement that this name correspond to the name of an actual collection in the database. |
| `description` | string | false | Description of the collection |
| `arguments` | [undefined](#undefined) | true | Any arguments that this collection requires |
| `type` | string | true | The name of the collection's object type |
| `uniqueness_constraints` | [undefined](#undefined) | true | Any uniqueness constraints enforced on this collection |
| `foreign_keys` | [undefined](#undefined) | true | Any foreign key constraints enforced on this collection |



### undefined

Any foreign key constraints enforced on this collection

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Foreign Key Constraint](#foreign-key constraint) | No |  |



### Foreign Key Constraint

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `column_mapping` | [undefined](#undefined) | true | The columns on which you want want to define the foreign key. |
| `foreign_collection` | string | true | The name of a collection |



### undefined

The columns on which you want want to define the foreign key.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | string | No |  |



### undefined

Any uniqueness constraints enforced on this collection

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Uniqueness Constraint](#uniqueness-constraint) | No |  |



### Uniqueness Constraint

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `unique_columns` | [string] | true | A list of columns which this constraint requires to be unique |



### undefined

Any arguments that this collection requires

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Argument Info](#argument-info) | No |  |



### Argument Info

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `description` | string | false | Argument description |
| `type` | [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) | true | The name of the type of this argument |



### undefined

A list of object types which can be used as the types of arguments, or return types of procedures. Names should not overlap with scalar type names.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Object Type](#object-type) | No |  |



### Object Type

The definition of an object type

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `description` | string | false | Description of this type |
| `fields` | [undefined](#undefined) | true | Fields defined on this object type |



### undefined

Fields defined on this object type

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Object Field](#object-field) | No |  |



### Object Field

The definition of an object field

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `description` | string | false | Description of this field |
| `type` | [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) | true | The type of this field |



### undefined

A list of scalar types which will be used as the types of collection columns

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Scalar Type](#scalar-type) | No |  |



### Scalar Type

The definition of a scalar type, i.e. types that can be used as the types of columns.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `aggregate_functions` | [undefined](#undefined) | true | A map from aggregate function names to their definitions. Result type names must be defined scalar types declared in ScalarTypesCapabilities. |
| `comparison_operators` | [undefined](#undefined) | true | A map from comparison operator names to their definitions. Argument type names must be defined scalar types declared in ScalarTypesCapabilities. |



### undefined

A map from comparison operator names to their definitions. Argument type names must be defined scalar types declared in ScalarTypesCapabilities.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) | No |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |
| `argument_type` | [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) | true | The type of the argument to this operator |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |



### undefined

A map from aggregate function names to their definitions. Result type names must be defined scalar types declared in ScalarTypesCapabilities.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [Aggregate Function Definition](#aggregate-function definition) | No |  |



### Aggregate Function Definition

The definition of an aggregation function on a scalar type

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `result_type` | [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) / [undefined](#undefined) | true | The scalar or object type of the result of this function |



### undefined

A predicate type for a given object type

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |
| `object_type_name` | string | true | The object type name |



### undefined

An array type

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |
| `element_type` | [Type](#type) | true | The type of the elements of the array |



### undefined

A nullable type

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |
| `underlying_type` | [Type](#type) | true | The type of the non-null inhabitants of this type |



### undefined

A named type

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |
| `name` | string | true | The name can refer to a primitive type or a scalar type |



### undefined

Key value map of HTTP headers to be sent with each request to the data connector.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `customKey` | [undefined](#undefined) / [undefined](#undefined) | No |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `readWriteUrls` | [ReadWriteUrls](#readwriteurls) | true |  |



### ReadWriteUrls

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `read` | [undefined](#undefined) / [undefined](#undefined) | true |  |
| `write` | [undefined](#undefined) / [undefined](#undefined) | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `singleUrl` | [undefined](#undefined) / [undefined](#undefined) | true |  |



### GraphqlConfig

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [GraphqlConfigV1](#graphqlconfigv1) | true |  |



### GraphqlConfigV1

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `query` | [QueryGraphqlConfig](#querygraphqlconfig) | true |  |
| `mutation` | [MutationGraphqlConfig](#mutationgraphqlconfig) | true |  |



### MutationGraphqlConfig

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `rootOperationTypeName` | string | true |  |



### QueryGraphqlConfig

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `rootOperationTypeName` | string | true |  |
| `argumentsInput` | [ArgumentsInputGraphqlConfig](#argumentsinputgraphqlconfig) / null | false |  |
| `limitInput` | [LimitInputGraphqlConfig](#limitinputgraphqlconfig) / null | false |  |
| `offsetInput` | [OffsetInputGraphqlConfig](#offsetinputgraphqlconfig) / null | false |  |
| `filterInput` | [FilterInputGraphqlConfig](#filterinputgraphqlconfig) / null | false |  |
| `orderByInput` | [OrderByInputGraphqlConfig](#orderbyinputgraphqlconfig) / null | false |  |



### OrderByInputGraphqlConfig

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldName` | string | true |  |
| `enumDirectionValues` | [OrderByDirectionValues](#orderbydirectionvalues) | true |  |
| `enumTypeNames` | [[OrderByEnumTypeName](#orderbyenumtypename)] | true |  |



### OrderByEnumTypeName

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `directions` | [string] | true |  |
| `typeName` | string | true |  |



### OrderByDirectionValues

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `asc` | string | true |  |
| `desc` | string | true |  |



### FilterInputGraphqlConfig

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldName` | string | true |  |
| `operatorNames` | [FilterInputOperatorNames](#filterinputoperatornames) | true |  |



### FilterInputOperatorNames

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `and` | string | true |  |
| `or` | string | true |  |
| `not` | string | true |  |
| `isNull` | string | true |  |



### OffsetInputGraphqlConfig

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldName` | string | true |  |



### LimitInputGraphqlConfig

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldName` | string | true |  |



### ArgumentsInputGraphqlConfig

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fieldName` | string | true |  |



### AuthConfig

Definition of the authentication configuration used by the API server.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `version` | string | true |  |
| `definition` | [AuthConfigV1](#authconfigv1) | true |  |



### AuthConfigV1

Definition of the authentication configuration used by the API server.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `allowRoleEmulationBy` | string / null | false |  |
| `mode` | [undefined](#undefined) / [undefined](#undefined) | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `jwt` | [JWTConfig](#jwtconfig) | true |  |



### JWTConfig

JWT config according to which the incoming JWT will be verified and decoded to extract the session variable claims.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `audience` | [string] | false | Optional validation to check that the `aud` field is a member of the `audience` recieved, otherwise will throw error. |
| `issuer` | string | false | Optional validation to check that the `iss` field is a member of the `iss` received, otherwise will throw error. |
| `allowedSkew` | integer | false | Allowed leeway (in seconds) to the `exp` validation to account for clock skew. |
| `claimsConfig` | [undefined](#undefined) / [undefined](#undefined) | true | Claims config. Either specified via `claims_mappings` or `claims_namespace_path` |
| `tokenLocation` | [undefined](#undefined) / [JWTCookieLocation](#jwtcookielocation) / [JWTHeaderLocation](#jwtheaderlocation) | true | Source of the JWT authentication token. |
| `key` | [undefined](#undefined) / [undefined](#undefined) | true | Mode according to which the JWT auth is configured. |

 #### Example

```yaml
audience: null
issuer: null
allowedSkew: null
claimsConfig:
  namespace:
    claimsFormat: Json
    location: /https:~1~1hasura.io~1jwt~1claims
tokenLocation:
  type: BearerAuthorization
key:
  fixed:
    algorithm: HS256
    key:
      value: token
```


### undefined

JWT mode where the `type` and `key` parameters are obtained dynamically through JWK.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `jwkFromUrl` | string | true |  |



### undefined

JWT mode when the algorithm `type` and `key` is known

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `fixed` | [JWTKeyConfig](#jwtkeyconfig) | true |  |



### JWTKeyConfig

JWT Secret config according to which the incoming JWT will be decoded.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `algorithm` | string / string / string / string / string / string / string / string / string / string / string / string | true | The algorithm used to decode the JWT. |
| `key` | [undefined](#undefined) / [undefined](#undefined) | true | The key to use for decoding the JWT. |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `valueFromEnv` | string | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `value` | string | true |  |



### JWTHeaderLocation

Custom header from where the header should be parsed from.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |
| `name` | string | true |  |



### JWTCookieLocation

Get the token from the Cookie header under the specificied cookie name.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |
| `name` | string | true |  |



### undefined

Get the bearer token from the `Authorization` header.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `type` | string | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `namespace` | [JWTClaimsNamespace](#jwtclaimsnamespace) | true |  |



### JWTClaimsNamespace

Used when all of the Hasura claims are present in a single object within the decoded JWT.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `claimsFormat` | string / string | true | Format in which the Hasura claims will be present. |
| `location` | string | true | Pointer to lookup the Hasura claims within the decoded claims. |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `locations` | [JWTClaimsMap](#jwtclaimsmap) | true |  |



### JWTClaimsMap

Can be used when Hasura claims are not all present in the single object, but individual claims are provided a JSON pointer within the decoded JWT and optionally a default value.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `x-hasura-default-role` | [undefined](#undefined) / [undefined](#undefined) | true | JSON pointer to lookup the default role within the decoded JWT. |
| `x-hasura-allowed-roles` | [undefined](#undefined) / [undefined](#undefined) | true | JSON pointer to lookup the allowed roles within the decoded JWT. |



### undefined

Look up the Hasura claims at the specified JSON Pointer and provide a default value if the lookup fails.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `path` | [JWTClaimsMappingPathEntry](#jwtclaimsmappingpathentry) | true |  |



### JWTClaimsMappingPathEntry

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `path` | string | true | JSON pointer to find the particular claim in the decoded JWT token. |
| `default` | string / null | false | Default value to be used when no value is found when looking up the value using the `path`. |



### undefined

Literal value of the claims mapping

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `literal` | string | true |  |



### undefined

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `webhook` | [AuthHookConfig](#authhookconfig) | true |  |



### AuthHookConfig

The configuration of the authentication webhook.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `url` | string | true | The URL of the authentication webhook. |
| `method` | string | true | The HTTP method to be used to make the request to the auth hook. |

 #### Example

```yaml
url: http://auth_hook:3050/validate-request
method: Post
```


### CompatibilityConfig

The compatibility configuration of the Hasura metadata.

| Name | Type | Required | Description |
|-----|-----|-----|-----|
| `kind` | string | true |  |
| `date` | string | true | Any backwards incompatible changes made to Hasura DDN after this date won't impact the metadata. |

