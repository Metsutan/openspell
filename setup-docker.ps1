# setup-docker.ps1
# Initializes the OpenSpell backend.

$ErrorActionPreference = "Stop"

Write-Host "[1/2] Generating .env config..." -ForegroundColor Cyan
node scripts/setup-env.js --mode=docker

Write-Host "[2/2] Building and starting stack..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host "==========================================" -ForegroundColor Green
Write-Host "OpenSpell is initialized and running!" -ForegroundColor Green
Write-Host "Check http://localhost:8887 in your browser." -ForegroundColor Green
Write-Host "Default admin login: admin / admin123" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
