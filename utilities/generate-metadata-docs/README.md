# Auto-generate Metadata Docs

## Overview

This utility will automatically generate a reference doc for Hasura Metadata using a provided
`supergraph_or_subgraph_object.jsonschema`. If examples are provided in the schema, they're transformed into YAML for
docs using `js-yaml`.

## Usage

Before running the first time — or when orchestrating CI — ensure you install all necessary dependencies:

```bash
cd utilities/generate-metadata-docs
# if you're running this in an Action, install TS
# npm install typescript
npm i
```

Assuming you have a `supergraph_or_subgraph_object.jsonschema` living in `/schema_examples`, you can run the following
to generate a new `metadata-reference.mdx` file that will override the existing one in `docs/supergraph-modeling`:

```bash
npm run build
npm run start
```

## Contributing

There are tests. Use them! You can use Jest's watch mode for testing by running:

```bash
npm run test
```

If you're more eager to develop with watch mode, and don't like tests (shame on you), run the following:

```bash
npm run watch
```
