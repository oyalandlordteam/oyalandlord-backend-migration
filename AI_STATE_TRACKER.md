# OyaLandlord - AI State & Context Tracker
*Provide this document to your AI when starting a new conversation or returning after a shutdown. It will instantly restore the AI's memory and state.*

## 1. Project Core & Stack
- **Name:** OyaLandlord (Nigeria's direct Landlord-to-Tenant Rental Platform).
- **Tech Stack:** Next.js 16 (App Router), TailwindCSS, Zustand (State & Routing), Prisma, SQLite.
- **Architecture:** The app uses a unique SPA-like routing system handled by `src/lib/router.tsx`, dynamically rendering views inside `src/app/page.tsx`.

## 2. Where We Stopped (Real-Time State)
- **Status:** Basic app layout is functional. We have analyzed the structure, created user manuals, and successfully launched the local server.
- **Last Actions Performed:** 
   1. Created `LAUNCH APP.bat` for one-click startup and DB syncing.
   2. Built comprehensive manual `OyaLandlord_Comprehensive_User_Manual.txt`.
   3. Mapped bug tracing architecture to `system_architecture_and_bug_tracing.md`.
   4. Added automated global error logging (Server: `logger.ts`, Client: `global-logger.tsx`, Log file: `tmp/app.log`).
- **Current Prompt/Focus:** Awaiting the user's command for the exact next feature to build.

## 3. Active Automations
1. **App Loader (`LAUNCH APP.bat`):** Automates package setup, DB migration, browser opening, and server hosting.
2. **Global Error Logger:** Automates bug tracking by capturing any crash or UI freeze silently and appending it to `tmp/app.log` on the backend.
3. **GitHub Auto-Sync (`SYNC_TO_GITHUB.bat`):** One-click automation to `git add`, `commit` (with timestamp), pull remote updates safely, and `push` the codebase securely to the cloud.

## 4. Pending Features / Backlog
- *(No new features assigned yet. Awaiting user instructions...)*

## 5. Instructions For The AI (When Loaded)
1. Do not ask for redundant explanations from the user. Read the stack and architecture.
2. Understand that anytime a feature is added or heavily modified, you MUST update this `AI_STATE_TRACKER.md` file immediately to preserve the state for the next session.
3. You MUST also update `OyaLandlord_Comprehensive_User_Manual.txt` if user-facing features change.
4. Greet the user and ask if they would like to continue with the "Pending Features" or work on something new.
