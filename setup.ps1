# Recipe Raid Co-op - Windows Installation Script
# Run this script in PowerShell from the RecipeRaid directory

Write-Host "🍳 Recipe Raid Co-op - Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install server dependencies
Write-Host "📦 Installing server dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Server dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""

# Install client dependencies
Write-Host "📦 Installing client dependencies..." -ForegroundColor Cyan
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Client dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up PostgreSQL database (see QUICKSTART.md)" -ForegroundColor White
Write-Host "2. Configure environment variables:" -ForegroundColor White
Write-Host "   - Copy server\.env.example to server\.env" -ForegroundColor White
Write-Host "   - Copy client\.env.local.example to client\.env.local" -ForegroundColor White
Write-Host "   - Update with your database and Supabase credentials" -ForegroundColor White
Write-Host "3. Run database migrations:" -ForegroundColor White
Write-Host "   psql -d recipe_raid -f server\database\schema.sql" -ForegroundColor White
Write-Host "4. Start the servers:" -ForegroundColor White
Write-Host "   Terminal 1: cd server && npm run dev" -ForegroundColor White
Write-Host "   Terminal 2: cd client && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📖 See QUICKSTART.md for detailed instructions" -ForegroundColor Cyan
Write-Host "🚀 Happy Raiding!" -ForegroundColor Magenta
