#!/bin/bash

echo "🚀 Setting up Invoice Tokenization Platform..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install it from https://rustup.rs/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo "📦 Installing Soroban CLI..."
    cargo install --locked soroban-cli
fi

echo "📦 Installing dependencies..."

# Build contracts
echo "🔨 Building Rust contracts..."
cd contracts
cargo build --target wasm32-unknown-unknown --release

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Install constants package dependencies
echo "📦 Installing constants package dependencies..."
cd ../packages/constants
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and configure your Stellar testnet account"
echo "2. Run 'make deploy' or 'deploy.bat' to deploy contracts"
echo "3. Update .env with deployed contract addresses"
echo "4. Run 'make dev' or 'dev.bat' to start the development server"
echo ""
echo "📖 See QUICK_START.md for detailed instructions"
