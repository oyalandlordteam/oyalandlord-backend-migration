@echo off
title Load OyaLandlord AI Context
echo ====================================================
echo Loading OyaLandlord AI Context...
echo ====================================================
echo.

if not exist "AI_STATE_TRACKER.md" (
    echo [ERROR] The AI_STATE_TRACKER.md file was not found!
    echo Please make sure you are running this from the project root folder.
    pause
    exit /b
)

:: Copy the contents of the AI_STATE_TRACKER.md file directly into the Windows clipboard
clip < "AI_STATE_TRACKER.md"

echo [SUCCESS] The AI Context has been successfully copied to your Clipboard!
echo.
echo Now, simply open a NEW chat with your AI (Gemini, ChatGPT, Claude, etc.)
echo and PASTE (Ctrl+V) the text. The AI will instantly know:
echo   - What the project is.
echo   - How the architecture works.
echo   - Exactly where you stopped building.
echo   - What features are pending.
echo.
echo ====================================================
pause
