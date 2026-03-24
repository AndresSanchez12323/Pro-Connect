param(
  [string]$ContainerName = "proconnect-postgres",
  [string]$DatabaseName = "proconnect",
  [string]$SqlFile = ".\proconnect.sql",
  [string]$DbUser = "postgres"
)

$ErrorActionPreference = "Stop"

function Get-DockerExe {
  $cmd = Get-Command docker -ErrorAction SilentlyContinue
  if ($cmd) {
    return "docker"
  }

  $defaultPath = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
  if (Test-Path $defaultPath) {
    return $defaultPath
  }

  throw "No se encontro Docker. Inicia Docker Desktop o agrega docker al PATH."
}

if (-not (Test-Path $SqlFile)) {
  throw "No se encontro el archivo SQL: $SqlFile"
}

$dockerExe = Get-DockerExe

Write-Host "Verificando contenedor $ContainerName..." -ForegroundColor Cyan
& $dockerExe ps --format "{{.Names}}" | Select-String -SimpleMatch $ContainerName | Out-Null
if ($LASTEXITCODE -ne 0) {
  throw "No se pudo consultar Docker."
}

$containerExists = (& $dockerExe ps --format "{{.Names}}") -contains $ContainerName
if (-not $containerExists) {
  throw "El contenedor $ContainerName no esta en ejecucion."
}

Write-Host "Copiando SQL al contenedor..." -ForegroundColor Cyan
& $dockerExe cp $SqlFile "$ContainerName`:/tmp/proconnect.sql"
if ($LASTEXITCODE -ne 0) {
  throw "Fallo al copiar el SQL al contenedor."
}

Write-Host "Recreando base de datos $DatabaseName..." -ForegroundColor Cyan
$terminateSql = "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DatabaseName' AND pid <> pg_backend_pid();"
& $dockerExe exec $ContainerName psql -U $DbUser -d postgres -c $terminateSql | Out-Null
& $dockerExe exec $ContainerName psql -U $DbUser -d postgres -c "DROP DATABASE IF EXISTS $DatabaseName;" | Out-Null
& $dockerExe exec $ContainerName psql -U $DbUser -d postgres -c "CREATE DATABASE $DatabaseName;" | Out-Null

Write-Host "Importando datos..." -ForegroundColor Cyan
& $dockerExe exec $ContainerName psql -U $DbUser -d $DatabaseName -f /tmp/proconnect.sql | Out-Null
if ($LASTEXITCODE -ne 0) {
  throw "Fallo al importar la base."
}

Write-Host "Base montada correctamente en '$DatabaseName' desde '$SqlFile'." -ForegroundColor Green
