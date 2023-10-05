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
COMMANDS=("" "local" "local init" "local daemon" "local daemon start" "cloud" "cloud project" "cloud project list" "cloud project create" "cloud project details" "cloud project remove" "cloud build" "cloud build apply" "cloud build create" "cloud build list" "cloud build remove" "cloud tunnel" "cloud tunnel list" "cloud tunnel create" "cloud tunnel activate" "cloud tunnel pause" "cloud tunnel delete" "cloud secret" "cloud secret list" "cloud secret set" "cloud secret delete" "cloud login" "cloud logout" "plugin")

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
