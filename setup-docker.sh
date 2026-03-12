#!/bin/bash
# setup-docker.sh
# Initializes the OpenSpell backend.

set -e

echo "[1/4] Generating .env config..."
docker compose --profile init run --rm env-init

echo "[2/4] Building and starting stack..."
docker compose up -d --build

echo "[3/4] Running migrations..."
docker compose --profile migrate run --rm migrate

echo "[4/4] Seeding initial data..."
docker compose run --rm api node packages/db/prisma/seed.js

echo "=========================================="
echo "OpenSpell is initialized and running!"
echo "Check http://localhost:8887 in your browser."
echo "Default admin login: admin / admin123"
echo "=========================================="
