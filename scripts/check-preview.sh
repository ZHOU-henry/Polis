#!/bin/zsh
set -euo pipefail

WEB_STATUS="$(curl -s http://127.0.0.1:3000 >/dev/null && echo ok || echo down)"
API_STATUS="$(curl -s http://127.0.0.1:3001/health >/dev/null && echo ok || echo down)"
RUNTIME="$(curl -s http://127.0.0.1:3001/runtime 2>/dev/null || echo '{}')"

echo "web=$WEB_STATUS"
echo "api=$API_STATUS"
echo "runtime=$RUNTIME"
