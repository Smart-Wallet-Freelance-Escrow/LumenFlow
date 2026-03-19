@echo off
echo 🚀 Invoice Tokenization - Quick Deploy to Stellar
echo.
echo 📋 STEP 1: Soroban Playground
echo ========================================
echo.
echo 1. Open: https://soroban.stellar.org/playground
echo 2. Click "New Project"
echo 3. Copy the invoice contract code from:
echo    contracts\invoice_contract_ready.rs
echo 4. Paste into playground and click "Build"
echo 5. Download the invoice_contract.wasm file
echo 6. Repeat for registry contract:
echo    contracts\registry_contract_ready.rs
echo.
pause

echo 📋 STEP 2: Get Stellar Testnet Account
echo ========================================
echo.
echo 1. Visit: https://stellar.expert/testnet
echo 2. Create account or use existing
echo 3. Copy your secret key for deployment
echo.
pause

echo 📋 STEP 3: Get Testnet XLM
echo ========================================
echo.
echo 1. Visit: https://friendbot.stellar.org
echo 2. Enter your public key
echo 3. Get 10,000 test XLM
echo.
pause

echo 📋 STEP 4: Deploy Contracts
echo ========================================
echo.
echo Once you have Soroban CLI and WASM files:
echo.
echo Deploy Invoice Contract:
echo soroban contract deploy --wasm invoice_contract.wasm --source YOUR_SECRET_KEY --network testnet
echo.
echo Deploy Registry Contract:
echo soroban contract deploy --wasm registry_contract.wasm --source YOUR_SECRET_KEY --network testnet
echo.
echo Initialize Contracts:
echo soroban contract invoke --id INVOICE_ADDRESS --source YOUR_SECRET_KEY --network testnet -- initialize --usdc_address GBBD47IF6LWK7P7MJVSCUFI274NM5YCFA247JEC2HGJLMD2BDQD2XUJR --registry_address REGISTRY_ADDRESS
echo.
echo soroban contract invoke --id REGISTRY_ADDRESS --source YOUR_SECRET_KEY --network testnet -- initialize --admin YOUR_PUBLIC_KEY
echo.
pause

echo 📋 STEP 5: Update Frontend
echo ========================================
echo.
echo Update your .env file with deployed addresses:
echo INVOICE_CONTRACT_ADDRESS=deployed_invoice_contract_address
echo REGISTRY_CONTRACT_ADDRESS=deployed_registry_contract_address
echo.
pause

echo 🎉 DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your invoice tokenization platform is now live on Stellar testnet!
echo Start the frontend: cd frontend && npm run dev
echo.
echo 📖 See FINAL_DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
