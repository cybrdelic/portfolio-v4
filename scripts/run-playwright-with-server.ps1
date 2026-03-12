$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

npm run build | Out-Host

$serverLog = Join-Path $repoRoot 'output/playwright/dist-server.log'
$serverErr = Join-Path $repoRoot 'output/playwright/dist-server.err.log'
New-Item -ItemType Directory -Force -Path (Split-Path $serverLog -Parent) | Out-Null
Remove-Item $serverLog, $serverErr -ErrorAction SilentlyContinue

$server = Start-Process `
  -FilePath 'node' `
  -ArgumentList 'scripts/serve-dist.mjs' `
  -RedirectStandardOutput $serverLog `
  -RedirectStandardError $serverErr `
  -PassThru `
  -WindowStyle Hidden

try {
  $deadline = (Get-Date).AddSeconds(20)
  $ready = $false

  do {
    try {
      $response = Invoke-WebRequest -Uri 'http://127.0.0.1:4173' -UseBasicParsing -TimeoutSec 2
      if ($response.StatusCode -eq 200) {
        $ready = $true
        break
      }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  } while ((Get-Date) -lt $deadline)

  if (-not $ready) {
    if (Test-Path $serverLog) {
      Write-Host '--- dist-server stdout ---'
      Get-Content $serverLog
    }
    if (Test-Path $serverErr) {
      Write-Host '--- dist-server stderr ---'
      Get-Content $serverErr
    }
    throw 'dist server did not become ready on http://127.0.0.1:4173'
  }

  $env:PLAYWRIGHT_EXTERNAL_SERVER = '1'
  & npx playwright test @args
  exit $LASTEXITCODE
} finally {
  if ($server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force
  }
}
