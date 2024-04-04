#!/bin/bash

# Directory to store generated MDX files
MDX_DIR="../../docs/cli/commands"

# Get rid of the old directory if it exists
rm -rf "$MDX_DIR"

# Create the directory if it doesn't exist
mkdir -p "$MDX_DIR"

# Create the _category_.json file
echo -e '{
  "label": "Commands",
  "position": 3
}
' > "$MDX_DIR/_category_.json"

# List of CLI commands
COMMANDS=("" "add" "add command" "add connector-manifest" "add model" "apply" "apply supergraph-build" "build" "build connector-manifest" "build supergraph-manifest" "completion" "completion bash" "completion fish" "completion powershell" "completion zsh" "create" "create project" "create subgraph" "delete" "delete project" "delete subgraph" "delete supergraph-build" "dev" "get" "get connector-build" "get project" "get region" "get subgraph" "get supergraph-build" "help" "login" "logout" "plugins" "plugins install" "plugins list" "plugins uninstall" "plugins upgrade" "update" "update command" "update connector-link" "update connector-manifest" "update model" "update-cli" "version")  
# Position counter
position=1

# Loop through each command
for cmd in "${COMMANDS[@]}"; do
  # Create a kabob-case file name
  cmd_slug=$(echo "$cmd" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

  # Capture the help text for the command
  help_text=$(ddn $cmd --help)

  # parse the first line of the help text
    synopsis=$(echo "$help_text" | head -n 1)

  # Create the MDX file with frontmatter and help text
  mdx_content="---
title: hasura3 $cmd
sidebar_position: $position
sidebar_label: ddn $cmd
description: Using the ddn $cmd command with the Hasura CLI
---

# Hasura DDN CLI: ddn $cmd 

## Synopsis
$synopsis.

\`\`\`bash
$ ddn $cmd --help
$help_text
\`\`\`
"

# if the file is "" then it is the root command and should be index.mdx
if [ "$cmd_slug" == "" ]; then
    cmd_slug="index"
fi

  # Save the MDX content to a file
  echo -e "$mdx_content" > "$MDX_DIR/$cmd_slug.mdx"
  ((position++))
  echo "Generated $cmd_slug.mdx"
done
