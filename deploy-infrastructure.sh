#!/bin/sh

SCRIPT=$(readlink -f "$0")
SCRIPT_PATH=$(dirname "$SCRIPT")
TEMPORARY_ENV_FILE=env.sh
npx ts-node "$SCRIPT_PATH"/lib/collectParams.ts $TEMPORARY_ENV_FILE
. "$SCRIPT_PATH"/$TEMPORARY_ENV_FILE
rm "$SCRIPT_PATH"/env.sh

echo ----------------------------------------------------------
echo Deploying infrastructure with following configuration:
echo "  Target cluster: $TARGET_CLUSTER"
echo "  Target environment: $TARGET_ENVIRONMENT"
echo ----------------------------------------------------------

if [ "$TARGET_CLUSTER" = minikube ]; then
  kubectl config use-context morecars
  kubectl config set-context --current --namespace="$TARGET_ENVIRONMENT"
  kubectl apply -k "$SCRIPT_PATH"/k8s/overlays/"$TARGET_ENVIRONMENT"

  # storing the certificate as kubernetes secret (if it doesn't exist yet)
  "$SCRIPT_PATH"/lib/store-certificate-as-k8s-secret.sh "$TARGET_ENVIRONMENT" "$SCRIPT_PATH"/dummy-certs
fi
