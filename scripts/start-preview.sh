#!/bin/zsh
set -euo pipefail

MODE="${1:-readonly}"
PASSWORD="${2:-}"
PID_FILE=".agora-preview.pid"
LOG_FILE="/tmp/agora-preview.log"

if [[ "$MODE" != "readonly" && "$MODE" != "interactive" ]]; then
  echo "Usage: ./scripts/start-preview.sh [readonly|interactive] [password]"
  exit 1
fi

if [[ "$MODE" == "readonly" && -z "$PASSWORD" ]]; then
  echo "Readonly preview requires a password argument."
  exit 1
fi

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${OLD_PID}" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Preview already running with PID $OLD_PID"
    exit 1
  fi
  rm -f "$PID_FILE"
fi

pkill -f '/Users/henry/projects/agora' >/dev/null 2>&1 || true

if [[ "$MODE" == "readonly" ]]; then
  export AGORA_PREVIEW_MODE=readonly
  export NEXT_PUBLIC_AGORA_PREVIEW_MODE=readonly
  export AGORA_ACCESS_PASSWORD="$PASSWORD"
else
  unset AGORA_PREVIEW_MODE || true
  unset NEXT_PUBLIC_AGORA_PREVIEW_MODE || true
  unset AGORA_ACCESS_PASSWORD || true
fi

nohup pnpm dev > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

echo "Agora preview started."
echo "Mode: $MODE"
echo "PID: $(cat "$PID_FILE")"
echo "Log: $LOG_FILE"
echo "Web: http://localhost:3000"
echo "Queue: http://localhost:3000/queue"
