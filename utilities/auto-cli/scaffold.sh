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
COMMANDS=("" "build" "build apply" "build create" "build delete" "build describe" "build list" "build watch" "completion" "completion bash" "completion fish" "completion powershell" "completion zsh" "daemon" "daemon start" "environment" "environment create" "environment delete" "environment describe" "environment list" "help" "init" "login" "logout" "metadata" "metadata add-hub-connector" "plugins" "plugins install" "plugins list" "plugins uninstall" "plugins upgrade" "project" "project create" "project delete" "project describe" "project list" "secret" "secret delete" "secret get" "secret list" "secret set" "subgraph" "subgraph create" "subgraph delete" "subgraph describe" "subgraph list" "tunnel" "tunnel activate" "tunnel create" "tunnel delete" "tunnel list" "tunnel pause" "update-cli" "version")

# Position counter
position=1

# Loop through each command
for cmd in "${COMMANDS[@]}"; do
  # Create a kabob-case file name
  cmd_slug=$(echo "$cmd" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

  # Capture the help text for the command
  help_text=$(hasura3 $cmd --help)

  # parse the first line of the help text
    synopsis=$(echo "$help_text" | head -n 1)

  # Create the MDX file with frontmatter and help text
  mdx_content="---
title: hasura3 $cmd
sidebar_position: $position
sidebar_label: hasura3 $cmd
description: Using the hasura3 $cmd command with the Hasura CLI
---

# Hasura3 CLI: hasura3 $cmd 

## Synopsis
$synopsis.

\`\`\`bash
$ hasura3 $cmd --help
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
