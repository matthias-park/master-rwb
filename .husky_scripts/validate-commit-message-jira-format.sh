#!/usr/bin/env bash
commit_regex='^(([a-z]){2,}-[0-9]+|merge|revert)'
error_msg="\033[31mAborting commit. Commit messages should start with a JIRA Issue 'GPN-123', 'DEVO-123', 'Merge', or 'Revert'\033[39m"

if ! grep -iqE "$commit_regex" "$HUSKY_GIT_PARAMS"; then
    echo "$error_msg" >&2
    exit 1
fi

echo "Commit message looks good!"
