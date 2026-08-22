param(
  [string]$Tag = $env:IMAGE_TAG,
  [string]$Registry = $env:REGISTRY
)

if (-not $Tag) { $Tag = "local" }
if (-not $Registry) { $Registry = "ghcr.io/openspell" }

$services = @("api", "web", "game", "chat")
foreach ($service in $services) {
  $image = "$Registry/$service:$Tag"
  Write-Host "Building $image"
  docker build -f "apps/$service/Dockerfile" -t $image .
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
