#!/usr/bin/env bash
# Ensures bun's version stays identical across mise.toml (source of truth) and
# every package.json's packageManager / devDependencies["@types/bun"].
set -euo pipefail
cd "$(dirname "$0")/.."

mise_bun=$(python3 -c 'import tomllib; print(tomllib.load(open("mise.toml", "rb"))["tools"]["bun"])')
if [[ -z "$mise_bun" ]]; then
  echo "error: no [tools].bun entry found in mise.toml" >&2
  exit 1
fi

fail=0
while IFS= read -r pkg; do
  pm=$(jq -r '.packageManager // empty' "$pkg")
  if [[ -n "$pm" && "$pm" != "bun@$mise_bun" ]]; then
    echo "mismatch: $pkg packageManager=$pm, expected bun@$mise_bun (mise.toml)" >&2
    fail=1
  fi

  types_bun=$(jq -r '.devDependencies["@types/bun"] // empty' "$pkg")
  if [[ -n "$types_bun" && "$types_bun" != "$mise_bun" ]]; then
    echo "mismatch: $pkg @types/bun=$types_bun, expected $mise_bun (mise.toml)" >&2
    fail=1
  fi
done < <(find . -name package.json -not -path '*/node_modules/*')

if [[ "$fail" -eq 0 ]]; then
  echo "bun version consistency OK: $mise_bun"
fi
exit "$fail"
