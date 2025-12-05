# Database Migration Script for Neon
# Run this to apply schema and seed data to your Neon database

$ErrorActionPreference = "Stop"

Write-Host "🔧 Recipe Raid - Database Migration" -ForegroundColor Cyan
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

$schemaFile = Join-Path $PSScriptRoot "..\database\schema.sql"
$seedFile = Join-Path $PSScriptRoot "..\database\seed.sql"

# Apply schema
Write-Host ""
Write-Host "📦 Applying schema..." -ForegroundColor Cyan
try {
    psql $env:DATABASE_URL -f $schemaFile
    Write-Host "✅ Schema applied successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to apply schema" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Apply seed data
Write-Host ""
Write-Host "🌱 Applying seed data..." -ForegroundColor Cyan
try {
    psql $env:DATABASE_URL -f $seedFile
    Write-Host "✅ Seed data applied successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Seed data failed (this is optional)" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Database migration complete!" -ForegroundColor Green
Write-Host ""
