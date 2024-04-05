#!/bin/bash

# Directory to store generated MDX files
MDX_DIR="../../docs/cli/commands"

# # Get rid of the old directory if it exists
# rm -rf "$MDX_DIR"

# # Create the directory if it doesn't exist
# mkdir -p "$MDX_DIR"

# # Create the _category_.json file
# echo -e '{
#   "label": "Commands",
#   "position": 3
# }
# ' > "$MDX_DIR/_category_.json"

# Generate list of CLI commands
COMMANDS=$(ddn --help | grep -E '^\s{2}[a-z]+' | awk '{print $1}' | sort)

# split commands by their new-line character
IFS=$'\n' read -rd '' -a COMMANDS <<< "$COMMANDS"

# We'll use this to store subcommands
SUBCOMMANDS=()

# Loop through each command to generate a list of subcommands
for cmd in "${COMMANDS[@]}"; do
  echo "🧰 Aggregating subcommands for $cmd"
  
  # we can ignore the ddn and help commands
  if [ "$cmd" == "ddn" ]; then
    continue
  fi
  
  # A bit of voodoo to get the right section for subcommands
  SINGLE_SUB_COMMANDS=$(ddn $cmd --help | \
    sed -n '/Available Commands:/,/^$/p' | \
    grep -E '^\s{2}[a-z]+' | \
    awk '{print $1}')

  IFS=$'\n' read -rd '' -a SINGLE_SUB_COMMANDS <<< "$SINGLE_SUB_COMMANDS"
  echo "  👀 Found ${#SINGLE_SUB_COMMANDS[@]} subcommands for $cmd"
  for subcmd in "${SINGLE_SUB_COMMANDS[@]}"; do
    echo "    📝 $subcmd"
    SUBCOMMANDS+=("$cmd $subcmd")
  done
done

# Concatenate the two lists
ALL_COMMANDS_SORTED=($(printf "%s\n" "${COMMANDS[@]}" "${SUBCOMMANDS[@]}" | sort))

echo "${ALL_COMMANDS_SORTED[@]}"

# # Position counter
# position=1

# # Loop through each command
# for cmd in "${COMMANDS[@]}"; do
#   # Create a kabob-case file name
#   cmd_slug=$(echo "$cmd" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

#   # Capture the help text for the command
#   help_text=$(ddn $cmd --help)

#   # parse the first line of the help text
#     synopsis=$(echo "$help_text" | head -n 1)

#   # Create the MDX file with frontmatter and help text
#   mdx_content="---
# title: hasura3 $cmd
# sidebar_position: $position
# sidebar_label: ddn $cmd
# description: Using the ddn $cmd command with the Hasura CLI
# ---

# # Hasura DDN CLI: ddn $cmd 

# ## Synopsis
# $synopsis.

# \`\`\`bash
# $ ddn $cmd --help
# $help_text
# \`\`\`
# "

# # if the file is "" then it is the root command and should be index.mdx
# if [ "$cmd_slug" == "" ]; then
#     cmd_slug="index"
# fi

#   # Save the MDX content to a file
#   echo -e "$mdx_content" > "$MDX_DIR/$cmd_slug.mdx"
#   ((position++))
#   echo "Generated $cmd_slug.mdx"
# done
