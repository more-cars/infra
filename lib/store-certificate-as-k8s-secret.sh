#!/bin/sh

K8S_NAMESPACE=$1
CERT_PATH=$2

kubectl get secret certificate-more-cars-wildcard \
  --namespace=$K8S_NAMESPACE \
  >/dev/null 2>&1

if [ $? -eq 0 ]; then
  exit # aborting, because secret already exists
fi

kubectl create secret tls certificate-more-cars-wildcard \
  --cert="$CERT_PATH"/tls.crt \
  --key="$CERT_PATH"/tls.key \
  --namespace=$K8S_NAMESPACE\
  >/dev/null 2>&1

if [ $? -eq 0 ]; then
  echo ✔️ Certificate stored as kubernetes secret »certificate-more-cars-wildcard« in namespace »$K8S_NAMESPACE«
fi
