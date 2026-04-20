#!/bin/bash
# quickdocs UserPromptSubmit hook
# Intercepts /docs commands, fetches docs, injects into Claude context via systemMessage.

QUICKDOCS_BIN="quickdocs"

# Read stdin JSON
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('prompt','').strip())" 2>/dev/null || echo "")

emit() {
  python3 -c "import json,sys; print(json.dumps({'systemMessage': sys.argv[1]}))" "$1"
  exit 0
}

# ── /docs service topic ── direct fetch ──────────────────────────────────────
if [[ "$PROMPT" =~ ^/docs[[:space:]]+([^[:space:]]+)[[:space:]]+(.+)$ ]]; then
  SERVICE="${BASH_REMATCH[1]}"
  TOPIC="${BASH_REMATCH[2]}"

  DOCS=$($QUICKDOCS_BIN get "$SERVICE" "$TOPIC" 2>/dev/null) || {
    emit "quickdocs: no docs found for '$SERVICE $TOPIC'. Try: quickdocs list"
  }

  emit "$(printf '[quickdocs] Docs injected. Present to user, no tool calls needed:\n\n%s' "$DOCS")"
fi

# ── /docs service (no topic) ── list topics ───────────────────────────────────
if [[ "$PROMPT" =~ ^/docs[[:space:]]+([^[:space:]]+)$ ]]; then
  SERVICE="${BASH_REMATCH[1]}"

  TOPICS=$($QUICKDOCS_BIN get "$SERVICE" --list 2>/dev/null) || {
    emit "quickdocs: could not list topics for '$SERVICE'."
  }

  emit "$(printf '[quickdocs] Topics for %s — show this list, ask user to type: /docs %s <topic>\n\n%s' "$SERVICE" "$SERVICE" "$TOPICS")"
fi

# ── /docs (no args) ── show service list ──────────────────────────────────────
if [[ "$PROMPT" == "/docs" ]]; then
  SERVICES=$($QUICKDOCS_BIN list 2>/dev/null) || {
    emit "quickdocs: could not load service list."
  }

  emit "$(printf '[quickdocs] Show this list, ask user to type: /docs <service> <topic>\n\n%s' "$SERVICES")"
fi

# No match — pass through silently
exit 0
