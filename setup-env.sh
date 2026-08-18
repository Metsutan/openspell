#!/usr/bin/env sh
set -e

MODE="${1:-docker}"
FORCE_FLAG=""
WRITE_DOCKER_ENV=""

if [ "$2" = "--force" ] || [ "$3" = "--force" ]; then
  FORCE_FLAG="--force"
fi

if [ "$2" = "--write-docker-env" ] || [ "$3" = "--write-docker-env" ]; then
  WRITE_DOCKER_ENV="--write-docker-env"
fi

node scripts/setup-env.js --mode="$MODE" $FORCE_FLAG $WRITE_DOCKER_ENV
