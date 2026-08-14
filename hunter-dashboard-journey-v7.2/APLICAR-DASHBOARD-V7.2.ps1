$ErrorActionPreference = "Stop"

$projectRoot = "C:\hunter-platform-clean"
$patchRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $projectRoot "backups\dashboard-v7.2-$timestamp"

if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
  throw "Projeto não encontrado em $projectRoot"
}

Write-Host "Criando backup em $backupRoot" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

$files = @(
  "apps\flight-api\src\modules\dashboard\dashboard.controller.ts",
  "apps\flight-api\src\modules\dashboard\dashboard.service.ts",
  "apps\flight-api\src\modules\dashboard\dto\dashboard-response.dto.ts",
  "apps\flight-web\app\page.tsx",
  "apps\flight-web\components\dashboard\HunterStatus.tsx",
  "apps\flight-web\lib\dashboard-api.ts",
  "docs\DASHBOARD_JOURNEY_V7.2.md"
)

foreach ($relative in $files) {
  $source = Join-Path $patchRoot $relative
  $destination = Join-Path $projectRoot $relative

  if (-not (Test-Path $source)) {
    throw "Arquivo do patch não encontrado: $source"
  }

  if (Test-Path $destination) {
    $backupDestination = Join-Path $backupRoot $relative
    New-Item -ItemType Directory -Path (Split-Path -Parent $backupDestination) -Force | Out-Null
    Copy-Item $destination $backupDestination -Force
  }

  New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
  Copy-Item $source $destination -Force
}

Write-Host "Patch aplicado. Validando backend e frontend..." -ForegroundColor Cyan
Push-Location $projectRoot
try {
  pnpm --filter @hunter/flight-api build
  if ($LASTEXITCODE -ne 0) { throw "O build do backend falhou." }

  pnpm --filter @hunter/flight-web build
  if ($LASTEXITCODE -ne 0) { throw "O build do frontend falhou." }
}
finally {
  Pop-Location
}

Write-Host "Dashboard V7.2 instalado e validado com sucesso." -ForegroundColor Green
Write-Host "Execute: cd C:\hunter-platform-clean; pnpm dev" -ForegroundColor Yellow
