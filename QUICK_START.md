# Quick Start Guide

## Prerequisites

1. **Install Rust**: https://rustup.rs/
2. **Install Node.js**: https://nodejs.org/ (v18+)
3. **Install Soroban CLI**: 
   ```bash
   cargo install --locked soroban-cli
   ```
4. **Create Stellar Testnet Account**: 
   - Visit https://stellar.expert/testnet
   - Create account and get secret key

## Setup

### 1. Install Dependencies

**Windows:**
```cmd
build.bat
```

**Mac/Linux:**
```bash
make install-deps
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Stellar testnet secret key:

```cmd
copy .env.example .env
```

Edit `.env`:
```
STELLAR_SECRET_KEY=your_testnet_secret_key_here
ADMIN_ADDRESS=your_public_key_here
```

### 3. Build Contracts

**Windows:**
```cmd
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

**Mac/Linux:**
```bash
make build-contracts
```

### 4. Deploy Contracts

**Windows:**
```cmd
deploy.bat
```

**Mac/Linux:**
```bash
make deploy
```

After deployment, update your `.env` file with the contract addresses returned.

### 5. Initialize Contracts

Create `init.bat` (Windows) or use `make init-contracts` (Mac/Linux) with your contract addresses.

### 6. Start Development Server

**Windows:**
```cmd
dev.bat
```

**Mac/Linux:**
```bash
make dev
```

## Testing the Platform

### As an Admin:
1. Visit http://localhost:3000
2. Connect wallet
3. Go to "Business Registry"
4. Register a test business
5. Verify the business

### As a Business:
1. Connect wallet (use a different account)
2. Get verified by admin
3. Go to "Mint Invoice"
4. Create a test invoice
5. Wait for funding

### As an Investor:
1. Connect wallet (use another account)
2. Go to "Fund Invoice"
3. Browse available invoices
4. Fund an invoice with testnet USDC
5. Wait for settlement

## Getting Testnet USDC

For testing, you'll need testnet USDC. This can be obtained from:
- Circle's testnet faucet (if available)
- Or mint test tokens for development

## Common Issues

**"make command not found" (Windows):**
- Use the provided `.bat` files instead
- Or install WSL for Linux commands

**"soroban command not found":**
- Install Soroban CLI: `cargo install --locked soroban-cli`

**Contract deployment fails:**
- Ensure your testnet account has enough XLM
- Check your secret key is correct

**Frontend won't connect:**
- Verify contract addresses in `.env`
- Check network is set to TESTNET

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Business      │    │   Investor      │    │     Admin       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ mint_invoice         │ fund_invoice         │ register/verify
          │──────────────────────▶│──────────────────────▶│
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Stellar Testnet                            │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Invoice Contract │    │Registry Contract │                │
│  │                 │    │                 │                │
│  │ - Mint invoices  │    │ - Business reg   │                │
│  │ - Fund invoices  │    │ - KYC verification│               │
│  │ - Settlement     │    │ - Admin controls │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                                 │
│  ┌─────────────────┐                                        │
│  │  USDC Contract  │                                        │
│  │                 │                                        │
│  │ - Testnet USDC  │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Support

- Check the main README.md for detailed documentation
- Open issues for bugs or feature requests
- Join our Discord for community support
