@echo off
:: This ensures the window Stays Open no matter what error occurs!
if "%~1"=="KEEPOPEN" goto :execute
cmd /k "%~f0" KEEPOPEN
exit /b

:execute
title OyaLandlord Launch Manager
echo ====================================================
echo Starting OyaLandlord Application
echo ====================================================
echo.

echo [1/4] Installing/Updating dependencies...
call npm install

echo.
echo [2/4] Syncing database schema to reflect any recent changes...
call npm run db:push

echo.
echo [3/4] Generating database client...
call npm run db:generate

echo.
echo [4/4] Starting Development Server...
echo The application will open in your default browser shortly.
echo.
echo ------------------------------------------
echo KEEP THIS WINDOW OPEN to run the application.
echo Close this window to shut down the application.
echo ------------------------------------------
echo.

:: Open the browser asynchronously
start http://localhost:3001

:: Start the Next.js development server and leave terminal open
call npm run dev
