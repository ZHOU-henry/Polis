#!/bin/zsh
set -euo pipefail

PID_FILE=".agora-preview.pid"

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${PID}" ]] && kill -0 "$PID" 2>/dev/null; then
    kill "$PID" >/dev/null 2>&1 || true
  fi
  rm -f "$PID_FILE"
fi

pkill -f '/Users/henry/projects/agora' >/dev/null 2>&1 || true

echo "Agora preview stopped."
