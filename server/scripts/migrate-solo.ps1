# Apply Database Migration for Solo Mode
# Run this script to update your Neon database with solo mode support

$ErrorActionPreference = "Stop"

Write-Host "🔧 Recipe Raid - Database Migration (Solo Mode)" -ForegroundColor Cyan
Write-Host ""

# Load DATABASE_URL from .env
$envFile = Join-Path $PSScriptRoot "..\..\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^DATABASE_URL=["'']?([^"'']+)["'']?') {
            $env:DATABASE_URL = $matches[1]
        }
    }
}

if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL not found in .env file" -ForegroundColor Red
    Write-Host "Please set DATABASE_URL in server/.env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found DATABASE_URL" -ForegroundColor Green

# Check if psql is available
try {
    $null = Get-Command psql -ErrorAction Stop
    Write-Host "✅ psql command found" -ForegroundColor Green
} catch {
    Write-Host "❌ psql not found. Please install PostgreSQL client tools." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

$migrationFile = Join-Path $PSScriptRoot "..\database\migrations\001_add_solo_mode.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Migration file not found: $migrationFile" -ForegroundColor Red
    exit 1
}

# Apply migration
Write-Host ""
Write-Host "📦 Applying migration..." -ForegroundColor Cyan
try {
    psql $env:DATABASE_URL -f $migrationFile
    Write-Host "✅ Migration applied successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to apply migration" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Database migration complete!" -ForegroundColor Green
Write-Host "You can now use solo mode in raids!" -ForegroundColor Green
Write-Host ""
