#!/bin/bash
# setup-docker.sh
# Initializes the OpenSpell backend.

set -e

echo "[1/2] Generating .env config..."
node scripts/setup-env.js --mode=docker

echo "[2/2] Building and starting stack..."
docker compose up -d --build

echo "=========================================="
echo "OpenSpell is initialized and running!"
echo "Check http://localhost:8887 in your browser."
echo "Default admin login: admin / admin123"
echo "=========================================="
