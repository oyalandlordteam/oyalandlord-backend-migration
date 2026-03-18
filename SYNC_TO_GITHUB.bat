@echo off
:: This ensures the window Stays Open no matter what error occurs!
if "%~1"=="KEEPOPEN" goto :execute
cmd /k "%~f0" KEEPOPEN
exit /b

:execute
setlocal enabledelayedexpansion

title GitHub Auto-Sync Workflow
echo ====================================================
echo Synchronizing OyaLandlord to GitHub...
echo ====================================================
echo.

:: 1. Read GITHUB_TOKEN securely from the .env file so we can bypass the 403 error
set "GITHUB_TOKEN="
if exist ".env" (
    for /f "tokens=1,* delims==" %%A in (.env) do (
        if "%%A"=="GITHUB_TOKEN" (
            set "RAW_TOKEN=%%B"
            set "GITHUB_TOKEN=!RAW_TOKEN:"=!"
        )
    )
)

if "!GITHUB_TOKEN!"=="" (
    echo [ERROR] No GITHUB_TOKEN found in your .env file!
    echo Please add your GitHub Personal Access Token to the .env file.
    goto :end
)

echo [1/4] Adding all recent changes...
git add .
if %errorlevel% neq 0 echo [WARNING] Git add encountered an issue.

echo.
echo [2/4] Committing changes with current timestamp...
git commit -m "Auto-Sync Build Progress: %date% %time%"

:: Get the current active Git branch
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%a

echo.
echo [3/4] Pulling latest updates from GitHub to prevent conflicts...
git pull https://!GITHUB_TOKEN!@github.com/oyalandlordteam/oyalandlord-backend-migration.git !CURRENT_BRANCH! --rebase

echo.
echo [4/4] Pushing to repository securely utilizing your Private Token...
git push https://!GITHUB_TOKEN!@github.com/oyalandlordteam/oyalandlord-backend-migration.git !CURRENT_BRANCH!

echo.
echo ====================================================
echo [STATUS] Auto-Sync Process Complete. Check the logs above for any errors.
echo ====================================================

:end
echo.
echo You can now close this window safely.
