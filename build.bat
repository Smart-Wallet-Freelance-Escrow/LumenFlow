@echo off
echo Installing dependencies...

echo Building Rust contracts...
cd contracts
cargo build
if %errorlevel% neq 0 (
    echo Failed to build contracts
    exit /b 1
)

echo Installing frontend dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    exit /b 1
)

echo Installing constants package dependencies...
cd ..\packages\constants
npm install
if %errorlevel% neq 0 (
    echo Failed to install constants dependencies
    exit /b 1
)

echo.
echo All dependencies installed successfully!
cd ..\..
pause
