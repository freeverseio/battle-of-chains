#!/bin/bash

FOLDER_PATH="."

echo "Starting script in folder: $FOLDER_PATH"
echo "pwd is: $(pwd)"

# Find all files with the .js or .html extension within the specified folder and its subdirectories, excluding node_modules
files=$(find "$FOLDER_PATH" -type d -name "node_modules" -prune -o -type f \( -name "*.js" -o -name "*.html" \) -print)

for file in $files; do
  echo "Processing file: $file"

  # Read the entire file content as a single string
  file_content=$(<"$file")

  # Initially assume no matches
  match_found=false

  # Find all matches of the pattern "NEXT_PUBLIC_<ENV_VAR_NAME>"
  while [[ $file_content =~ NEXT_PUBLIC_([A-Z_]+) ]]; do
    match_found=true

    # Extract the matched string
    match=${BASH_REMATCH[0]}

    # Retrieve the corresponding environment variable value
    value="${!match}"

    # Log only if a match is found
    echo "Match found: '$match' in file $file. Replacing with value: '$value'"

    # Replace the matched string with the environment variable value
    file_content=${file_content//$match/$value}
  done

  if [[ "$match_found" == true ]]; then
    # Write the modified content to a temporary file
    echo "$file_content" > "$file.tmp"

    # Replace the original file with the modified version
    mv "$file.tmp" "$file"

    echo "Updated file $file"
  fi
done

echo "All files processed."

exec node server.js