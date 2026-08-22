#!/usr/bin/env sh
set -e

TAG="${IMAGE_TAG:-local}"
REGISTRY="${REGISTRY:-ghcr.io/openspell}"

for service in api web game chat; do
  image="${REGISTRY}/${service}:${TAG}"
  echo "Building ${image}"
  docker build -f "apps/${service}/Dockerfile" -t "${image}" .
done
