param(
    [ValidateSet("dev", "docker", "prod")]
    [string]$Mode = "docker",
    [switch]$Force,
    [switch]$WriteDockerEnv
)

$repoRoot = $PSScriptRoot
if (-not $repoRoot) {
    $repoRoot = Get-Location
}

Write-Host "Setting up OpenSpell environment files (mode: $Mode)..." -ForegroundColor Green
Write-Host "Defaults target a single-player local setup (lowest security, minimal services)." -ForegroundColor Yellow

# Reference (root .env anti-cheat realtime):
# - ANTI_CHEAT_WEALTH_TRANSFER_WINDOW_MS=10000
# - ANTI_CHEAT_WEALTH_TRANSFER_VALUE_THRESHOLD=500000
# - ANTI_CHEAT_SHARED_IP_WINDOW_MS=30000
# - ANTI_CHEAT_SESSION_ALERT_START_HOURS=9
# - ANTI_CHEAT_SESSION_ALERT_STEP_HOURS=3

$scriptPath = Join-Path $repoRoot "scripts\setup-env.js"
if (-not (Test-Path $scriptPath)) {
    Write-Host "Missing scripts\setup-env.js. Please run from repo root." -ForegroundColor Red
    exit 1
}

$scriptArgs = @("--mode=$Mode")
if ($Force) { $scriptArgs += "--force" }
if ($WriteDockerEnv) { $scriptArgs += "--write-docker-env" }

node $scriptPath @scriptArgs
