#!/bin/bash

output_file="aggregation_output.txt"
target_dir="."
include_hidden=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --path=*) target_dir="${1#*=}" ;;
        --path) target_dir="$2"; shift ;;
        --include-hidden) include_hidden=1 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

[ ! -d "$target_dir" ] && { echo "Error: Directory $target_dir not found."; exit 1; }

> "$output_file"

find "$target_dir" ${include_hidden:+-not -path '*/.*'} -type f -print0 | 
while IFS= read -r -d '' file; do
    if file "$file" | grep -qE 'text|empty|data'; then
        {
            echo "| start >>> $file >>>"
            cat "$file"
            echo "<<< $file <<< end |"
            echo
        } >> "$output_file"
    fi
done

echo "Aggregation complete. Output: $output_file"
