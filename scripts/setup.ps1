Write-Host "🚀 Setting up Invoice Tokenization Platform..." -ForegroundColor Green

# Check if Rust is installed
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Rust is not installed. Please install it from https://rustup.rs/" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install it from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if Soroban CLI is installed
if (-not (Get-Command soroban -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Soroban CLI..." -ForegroundColor Yellow
    cargo install --locked soroban-cli
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Blue

# Build contracts
Write-Host "🔨 Building Rust contracts..." -ForegroundColor Blue
Set-Location contracts
cargo build --target wasm32-unknown-unknown --release

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
Set-Location ..\frontend
npm install

# Install constants package dependencies
Write-Host "📦 Installing constants package dependencies..." -ForegroundColor Blue
Set-Location ..\packages\constants
npm install

Write-Host "" -ForegroundColor White
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env and configure your Stellar testnet account" -ForegroundColor White
Write-Host "2. Run 'deploy.bat' to deploy contracts" -ForegroundColor White
Write-Host "3. Update .env with deployed contract addresses" -ForegroundColor White
Write-Host "4. Run 'dev.bat' to start the development server" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "📖 See QUICK_START.md for detailed instructions" -ForegroundColor Cyan

Set-Location ..\..
