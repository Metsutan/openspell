# OpenSpell HTTPS Setup Script (Windows PowerShell)
# - Installs mkcert if possible (Chocolatey/Scoop)
# - Creates locally-trusted dev certificates under ./certs
#
# Usage (from repo root):
#   .\setup-https.ps1

$ErrorActionPreference = "Stop"

function Get-RepoRoot {
    return (Split-Path -Parent $PSCommandPath)
}

function Ensure-Dir($Path) {
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function Command-Exists($Name) {
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Is-Admin {
    $principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Try-Install-Mkcert {
    if (Command-Exists "mkcert") { return $true }

    if (Command-Exists "scoop") {
        Write-Host "mkcert not found. Installing via Scoop..." -ForegroundColor Yellow
        scoop bucket add extras | Out-Null
        scoop install mkcert | Out-Host
        return (Command-Exists "mkcert")
    }

    if (Command-Exists "choco") {
        if (-not (Is-Admin)) {
            Write-Host "Chocolatey is available, but this shell is not elevated. Skipping choco install." -ForegroundColor Yellow
            return $false
        }

        Write-Host "mkcert not found. Installing via Chocolatey..." -ForegroundColor Yellow
        choco install mkcert -y | Out-Host
        return (Command-Exists "mkcert")
    }

    return $false
}

function Download-MkcertExe {
    param(
        [Parameter(Mandatory=$true)][string]$RepoRoot
    )

    $toolsDir = Join-Path $RepoRoot "tools"
    Ensure-Dir $toolsDir

    $mkcertExe = Join-Path $toolsDir "mkcert.exe"

    # Official mkcert "latest" endpoint.
    $uri = "https://dl.filippo.io/mkcert/latest?for=windows/amd64"
    Write-Host "Downloading mkcert from $uri ..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $uri -OutFile $mkcertExe

    return $mkcertExe
}

function Resolve-MkcertCmd {
    param(
        [Parameter(Mandatory=$true)][string]$RepoRoot
    )

    if (Command-Exists "mkcert") { return "mkcert" }
    if (Try-Install-Mkcert) { return "mkcert" }

    return (Download-MkcertExe -RepoRoot $RepoRoot)
}

function Upsert-EnvVar {
    param(
        [Parameter(Mandatory=$true)][string]$FilePath,
        [Parameter(Mandatory=$true)][string]$Key,
        [Parameter(Mandatory=$true)][string]$Value
    )

    $line = "$Key=$Value"

    if (-not (Test-Path $FilePath)) {
        $dir = Split-Path -Parent $FilePath
        if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
        $line | Out-File -FilePath $FilePath -Encoding utf8
        return
    }

    $content = Get-Content $FilePath -Raw
    $lines = $content -split "\r?\n"

    $found = $false
    $newLines = @()
    foreach ($l in $lines) {
        if ($l -match "^\s*${Key}\s*=") {
            $newLines += $line
            $found = $true
        } else {
            $newLines += $l
        }
    }

    if (-not $found) {
        if ($newLines.Count -gt 0 -and $newLines[-1] -ne "") { $newLines += "" }
        $newLines += $line
    }

    ($newLines -join "`r`n") | Out-File -FilePath $FilePath -Encoding utf8
}

Write-Host "Setting up local HTTPS (mkcert)..." -ForegroundColor Green

$repoRoot = Get-RepoRoot
$certDir = Join-Path $repoRoot "certs"
$certPath = Join-Path $certDir "localhost.pem"
$keyPath = Join-Path $certDir "localhost-key.pem"

Ensure-Dir $certDir

$mkcert = Resolve-MkcertCmd -RepoRoot $repoRoot

Write-Host "Installing local CA (mkcert -install)..." -ForegroundColor Yellow
& $mkcert -install | Out-Host

Write-Host "Generating cert for localhost, 127.0.0.1, ::1 ..." -ForegroundColor Yellow
& $mkcert -cert-file "$certPath" -key-file "$keyPath" localhost 127.0.0.1 ::1 | Out-Host

$certPathEnv = ($certPath -replace "\\", "/")
$keyPathEnv = ($keyPath -replace "\\", "/")

# Update app .env files (best-effort, idempotent)
Write-Host ""
Write-Host "Updating apps/api/.env and apps/web/.env to enable HTTPS..." -ForegroundColor Yellow

$apiEnv = Join-Path $repoRoot "apps\api\.env"
Upsert-EnvVar -FilePath $apiEnv -Key "USE_HTTPS" -Value "true"
Upsert-EnvVar -FilePath $apiEnv -Key "USING_REVERSE_PROXY" -Value "false"
Upsert-EnvVar -FilePath $apiEnv -Key "SSL_CERT_PATH" -Value "`"$certPathEnv`""
Upsert-EnvVar -FilePath $apiEnv -Key "SSL_KEY_PATH" -Value "`"$keyPathEnv`""
Upsert-EnvVar -FilePath $apiEnv -Key "WEB_URL" -Value "`"https://localhost:8887`""
Upsert-EnvVar -FilePath $apiEnv -Key "API_URL" -Value "`"https://localhost:3002`""

$webEnv = Join-Path $repoRoot "apps\web\.env"
Upsert-EnvVar -FilePath $webEnv -Key "USE_HTTPS" -Value "true"
Upsert-EnvVar -FilePath $webEnv -Key "USING_REVERSE_PROXY" -Value "false"
Upsert-EnvVar -FilePath $webEnv -Key "SSL_CERT_PATH" -Value "`"$certPathEnv`""
Upsert-EnvVar -FilePath $webEnv -Key "SSL_KEY_PATH" -Value "`"$keyPathEnv`""
Upsert-EnvVar -FilePath $webEnv -Key "API_URL" -Value "`"https://localhost:3002`""

Write-Host ""
Write-Host "Done. Cert files:" -ForegroundColor Green
Write-Host "  cert: $certPath" -ForegroundColor Cyan
Write-Host "  key:  $keyPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Updated env files:" -ForegroundColor Green
Write-Host "  $apiEnv" -ForegroundColor Cyan
Write-Host "  $webEnv" -ForegroundColor Cyan
Write-Host ""
Write-Host "Start servers and browse:" -ForegroundColor Green
Write-Host "  Web: https://localhost:8887" -ForegroundColor Cyan
Write-Host "  API: https://localhost:3002" -ForegroundColor Cyan


