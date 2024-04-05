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

# Generate list of CLI commands
IFS=$'\n' read -rd '' -a COMMANDS <<< "$(ddn --help | grep -E '^\s{2}[a-z]+' | awk '{print $1}' | sort)"

# Initialize an array for subcommands
declare -a SUBCOMMANDS

# Loop through each command to generate a list of subcommands
for cmd in "${COMMANDS[@]}"; do
  echo "🧰 Aggregating subcommands for $cmd"
  
  # we can ignore the ddn and help commands
  if [[ "$cmd" == "ddn" || "$cmd" == "help" ]]; then
    continue
  fi
  
  # Correctly capture subcommands, preserving spaces
  IFS=$'\n' read -rd '' -a SINGLE_SUB_COMMANDS <<< "$(ddn "$cmd" --help | sed -n '/Available Commands:/,/^$/p' | grep -E '^\s{2}[a-z]+' | awk '{print $1}')"
  
  echo "  👀 Found ${#SINGLE_SUB_COMMANDS[@]} subcommands for $cmd"
  
  for subcmd in "${SINGLE_SUB_COMMANDS[@]}"; do
    trimmed_subcmd=$(echo "$subcmd" | tr -d '\n')
    SUBCOMMANDS+=("$cmd $trimmed_subcmd")
    echo "    📝 $trimmed_subcmd"
  done
done

# Combine COMMANDS and SUBCOMMANDS, and sort them
ALL_COMMANDS_SORTED=("${COMMANDS[@]}" "${SUBCOMMANDS[@]}")
IFS=$'\n' ALL_COMMANDS_SORTED=($(sort <<<"${ALL_COMMANDS_SORTED[*]}"))

# Position counter
position=1

# Loop through each command/subcommand
for cmd in "${ALL_COMMANDS_SORTED[@]}"; do
  # Create a kabob-case file name
  cmd_slug=$(echo "$cmd" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

  # Capture the help text for the command
  help_text=$(eval "ddn $cmd --help")

  # If the file name is ddn, set it to index.mdx
  if [ "$cmd_slug" == "ddn" ]; then
    cmd_slug="index"
    help_text=$($cmd --help)
  fi

  # parse the first line of the help text
  synopsis=$(echo "$help_text" | head -n 1)

  # Create the MDX file with frontmatter and help text
  mdx_content="---
title: \"ddn $cmd\"
sidebar_position: $position
sidebar_label: \"ddn $cmd\"
description: \"Using the ddn $cmd command with the Hasura CLI\"
---

# Hasura DDN CLI: ddn $cmd

## Synopsis
$synopsis

\`\`\`bash
$ ddn $cmd --help
$help_text
\`\`\`
"

  # Save the MDX content to a file
  echo -e "$mdx_content" > "$MDX_DIR/$cmd_slug.mdx"
  ((position++))
  echo "🚀 Generated $cmd_slug.mdx"
done

echo "✅ Documentation generation complete!"