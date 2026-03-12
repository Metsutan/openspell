# setup-docker.ps1
# Initializes the OpenSpell backend.

$ErrorActionPreference = "Stop"

Write-Host "[1/4] Generating .env config..." -ForegroundColor Cyan
docker compose --profile init run --rm env-init

Write-Host "[2/4] Building and starting stack..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host "[3/4] Running migrations..." -ForegroundColor Cyan
docker compose --profile migrate run --rm migrate

Write-Host "[4/4] Seeding initial data..." -ForegroundColor Cyan
docker compose run --rm api node packages/db/prisma/seed.js

Write-Host "==========================================" -ForegroundColor Green
Write-Host "OpenSpell is initialized and running!" -ForegroundColor Green
Write-Host "Check http://localhost:8887 in your browser." -ForegroundColor Green
Write-Host "Default admin login: admin / admin123" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
