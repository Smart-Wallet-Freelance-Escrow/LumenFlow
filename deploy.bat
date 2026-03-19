@echo off
echo Deploying contracts to testnet...
echo Make sure you have STELLAR_SECRET_KEY environment variable set

echo Deploying invoice contract...
cd contracts\invoice
soroban contract deploy --wasm target\wasm32-unknown-unknown\release\invoice_contract.wasm --source %STELLAR_SECRET_KEY% --network testnet
if %errorlevel% neq 0 (
    echo Failed to deploy invoice contract
    exit /b 1
)

echo Deploying registry contract...
cd ..\registry
soroban contract deploy --wasm target\wasm32-unknown-unknown\release\registry_contract.wasm --source %STELLAR_SECRET_KEY% --network testnet
if %errorlevel% neq 0 (
    echo Failed to deploy registry contract
    exit /b 1
)

echo.
echo Contracts deployed successfully!
echo Update your .env file with the contract addresses
cd ..\..
pause
