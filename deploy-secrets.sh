#!/bin/sh
set -e

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")

NAMESPACE="$1"
CONTEXT="$2"

if [ -z "$NAMESPACE" ]; then
  echo "Usage: $0 <namespace> [context]"
  exit 1
fi

if [ -z "$CONTEXT" ]; then
  CONTEXT=$(kubectl config current-context)
fi

echo "Creating secrets for:"
echo "  context:   $CONTEXT"
echo "  namespace: $NAMESPACE"
echo ""

for file in "$SCRIPT_PATH"/k8s/secrets/*.yaml; do
  name=$(kubectl --context "$CONTEXT" -n "$NAMESPACE" apply -f "$file" --dry-run=client -o jsonpath='{.metadata.name}')

  if kubectl --context "$CONTEXT" -n "$NAMESPACE" get secret "$name" >/dev/null 2>&1; then
    echo "  - $name exists → skip"
  else
    echo "  - creating $name"
    kubectl --context "$CONTEXT" -n "$NAMESPACE" apply -f "$file"
  fi
done
