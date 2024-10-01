export const commandExample = `---
kind: Command
version: v1
definition:
  name: Hello
  outputType: String!
  arguments:
    - name: name
      type: String
  source:
    dataConnectorName: my_data_connector
    dataConnectorCommand:
      function: hello
  graphql:
    rootFieldName: hello
    rootFieldKind: Query`;
