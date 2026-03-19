.PHONY: help build clean deploy test install-deps generate-bindings

# Default target
help:
	@echo "Available targets:"
	@echo "  install-deps    - Install all dependencies"
	@echo "  build           - Build all contracts and frontend"
	@echo "  build-contracts - Build Rust contracts only"
	@echo "  build-frontend  - Build Next.js frontend only"
	@echo "  deploy          - Deploy contracts to testnet"
	@echo "  test            - Run tests for contracts"
	@echo "  generate-bindings - Generate TypeScript bindings for frontend"
	@echo "  clean           - Clean build artifacts"

# Install dependencies
install-deps:
	@echo "Installing dependencies..."
	cd contracts && cargo build
	cd frontend && npm install
	cd packages/constants && npm install

# Build everything
build: build-contracts build-frontend

# Build contracts
build-contracts:
	@echo "Building Soroban contracts..."
	cd contracts && cargo build --target wasm32-unknown-unknown --release

# Build frontend
build-frontend:
	@echo "Building Next.js frontend..."
	cd frontend && npm run build

# Deploy contracts to testnet
deploy:
	@echo "Deploying contracts to testnet..."
	@echo "Make sure you have STELLAR_SECRET_KEY environment variable set"
	cd contracts/invoice && soroban contract deploy --wasm target/wasm32-unknown-unknown/release/invoice_contract.wasm --source $$STELLAR_SECRET_KEY --network testnet
	cd contracts/registry && soroban contract deploy --wasm target/wasm32-unknown-unknown/release/registry_contract.wasm --source $$STELLAR_SECRET_KEY --network testnet

# Run tests
test:
	@echo "Running contract tests..."
	cd contracts && cargo test

# Generate TypeScript bindings
generate-bindings:
	@echo "Generating TypeScript bindings..."
	@echo "This requires soroban-cli and the contracts to be built"
	# Generate bindings for invoice contract
	cd contracts/invoice && soroban contract bindings typescript --wasm target/wasm32-unknown-unknown/release/invoice_contract.wasm --output-dir ../../frontend/src/bindings/invoice
	# Generate bindings for registry contract  
	cd contracts/registry && soroban contract bindings typescript --wasm target/wasm32-unknown-unknown/release/registry_contract.wasm --output-dir ../../frontend/src/bindings/registry

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	cd contracts && cargo clean
	cd frontend && rm -rf .next node_modules
	cd packages/constants && rm -rf node_modules dist

# Development server
dev:
	@echo "Starting development server..."
	cd frontend && npm run dev

# Format code
format:
	@echo "Formatting code..."
	cd contracts && cargo fmt
	cd frontend && npm run lint

# Check code
check:
	@echo "Checking code..."
	cd contracts && cargo check
	cd frontend && npm run lint

# Initialize contracts (after deployment)
init-contracts:
	@echo "Initializing contracts..."
	@echo "Make sure CONTRACT_ADDRESSES are set in .env"
	# Initialize invoice contract
	soroban contract invoke \
		--id $$INVOICE_CONTRACT_ADDRESS \
		--source $$STELLAR_SECRET_KEY \
		--network testnet \
		-- \
		initialize \
		--usdc_address $$USDC_CONTRACT_ADDRESS \
		--registry_address $$REGISTRY_CONTRACT_ADDRESS
	# Initialize registry contract
	soroban contract invoke \
		--id $$REGISTRY_CONTRACT_ADDRESS \
		--source $$STELLAR_SECRET_KEY \
		--network testnet \
		-- \
		initialize \
		--admin $$ADMIN_ADDRESS
