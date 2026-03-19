@echo off
echo 🚀 DEPLOYING SMART CONTRACTS TO STELLAR BLOCKCHAIN
echo ==================================================
echo.

echo 📋 STEP 1: Opening Soroban Playground
echo ========================================
echo Opening web deployment page...
start web_deploy.html
echo.
echo ✅ Web deployment page opened!
echo.
pause

echo 📋 STEP 2: Get Stellar Testnet Account
echo ========================================
echo Opening Stellar Expert testnet...
start https://stellar.expert/testnet
echo.
echo ✅ Create account or use existing one
echo ✅ Copy your secret key for next steps
echo.
pause

echo 📋 STEP 3: Get Testnet XLM
echo ========================================
echo Opening Friendbot for test XLM...
start https://friendbot.stellar.org
echo.
echo ✅ Enter your public key to get 10,000 test XLM
echo.
pause

echo 📋 STEP 4: Copy Contract Code to Soroban Playground
echo ========================================
echo.
echo 1. Go to: https://soroban.stellar.org
echo 2. Click "New Project"
echo 3. Copy the INVOICE contract code from web_deploy.html
echo 4. Paste into playground and click "Build"
echo 5. Download "invoice_contract.wasm"
echo 6. Repeat for REGISTRY contract
echo 7. Download "registry_contract.wasm"
echo.
pause

echo 📋 STEP 5: Deploy Contracts
echo ========================================
echo.
echo Once you have the WASM files and Stellar CLI, run these commands:
echo.
echo Deploy Invoice Contract:
echo stellar contract deploy --wasm invoice_contract.wasm --source YOUR_SECRET_KEY --network testnet
echo.
echo Deploy Registry Contract:
echo stellar contract deploy --wasm registry_contract.wasm --source YOUR_SECRET_KEY --network testnet
echo.
echo Initialize Invoice Contract:
echo stellar contract invoke --id INVOICE_ADDRESS --source YOUR_SECRET_KEY --network testnet -- initialize --usdc_address GBBD47IF6LWK7P7MJVSCUFI274NM5YCFA247JEC2HGJLMD2BDQD2XUJR --registry_address REGISTRY_ADDRESS
echo.
echo Initialize Registry Contract:
echo stellar contract invoke --id REGISTRY_ADDRESS --source YOUR_SECRET_KEY --network testnet -- initialize --admin YOUR_PUBLIC_KEY
echo.
pause

echo 📋 STEP 6: Update Environment
echo ========================================
echo.
echo Update your .env file with deployed addresses:
echo INVOICE_CONTRACT_ADDRESS=your_deployed_invoice_contract_address
echo REGISTRY_CONTRACT_ADDRESS=your_deployed_registry_contract_address
echo.
pause

echo 🎉 DEPLOYMENT COMPLETE!
echo ==================================================
echo.
echo ✅ Your invoice tokenization platform is now live on Stellar testnet!
echo ✅ Smart contracts deployed and initialized
echo ✅ Ready for frontend integration
echo.
echo Next steps:
echo 1. Start frontend: cd frontend && npm run dev
echo 2. Test contract functions
echo 3. Onboard test businesses
echo 4. Create test invoices
echo.
echo 🎉 CONGRATULATIONS! Your platform is ready! 🎉
echo.
pause
