#!/bin/bash
set -euo pipefail

# OpenSpell HTTPS Setup Script (Linux/Mac)
# - Requires mkcert to already be installed
# - Creates locally-trusted dev certificates under ./certs
#
# Usage (from repo root):
#   ./setup-https.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERT_DIR="${ROOT_DIR}/certs"
CERT_PATH="${CERT_DIR}/localhost.pem"
KEY_PATH="${CERT_DIR}/localhost-key.pem"

mkdir -p "${CERT_DIR}"

if ! command -v mkcert >/dev/null 2>&1; then
  echo "ERROR: mkcert not found."
  echo "Install it from https://github.com/FiloSottile/mkcert and rerun."
  exit 1
fi

echo "Installing local CA (mkcert -install)..."
mkcert -install

echo "Generating cert for localhost, 127.0.0.1, ::1 ..."
mkcert -cert-file "${CERT_PATH}" -key-file "${KEY_PATH}" localhost 127.0.0.1 ::1

echo ""
echo "Done."
echo "  cert: ${CERT_PATH}"
echo "  key:  ${KEY_PATH}"
echo ""
echo "To enable HTTPS for the dev servers, add these to apps/api/.env and apps/web/.env:"
echo "  USE_HTTPS=true"
echo "  USING_REVERSE_PROXY=false"
echo "  SSL_CERT_PATH=\"../../certs/localhost.pem\""
echo "  SSL_KEY_PATH=\"../../certs/localhost-key.pem\""
echo ""
echo "Also update URLs so CORS + API calls match HTTPS:"
echo "  apps/api/.env: WEB_URL=\"https://localhost:8887\""
echo "  apps/web/.env: API_URL=\"https://localhost:3002\""


