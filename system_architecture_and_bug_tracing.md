# OyaLandlord System Architecture & Bug Tracing Roadmap

This document serves as a comprehensive guide to understanding the application's structure, data flow, and features, providing a vital resource for tracing and fixing bugs manually.

## 1. High-Level Architecture
OyaLandlord is built using **Next.js 16 (App Router)** but functions largely as a **Single Page Application (SPA)** on the client side.

- **Frontend:** React, Tailwind CSS, shadcn/ui components.
- **State Management:** `zustand` handles both global data (users, properties, rentals) and SPA routing. State stores often persist data via `localStorage`.
- **Backend:** Next.js Route Handlers (`src/app/api/...`).
- **Database:** SQLite managed through Prisma ORM.

---

## 2. Core Navigation & Routing (The "SPA" Mechanics)
Unlike typical Next.js apps that use folder-based routing (e.g., `/dashboard`), this app uses a custom global state router.

### Where to look for routing bugs:
- **`src/lib/router.tsx`**: Contains the `useRouter` store that tracks `currentView` (e.g., `'home'`, `'login'`, `'tenant-dashboard'`).
- **`src/app/page.tsx`**: The **Master Controller**. It listens to `currentView` and conditionally renders the components from `src/views/`. If a page is not rendering, check the `renderContent()` switch statement here.
- **`src/components/navbar.tsx`**: The main navigation menu that triggers `navigate('view-name')`.

---

## 3. State Management (`src/lib/store.ts`)
All data fetched from the API is cached inside large Zustand stores in `src/lib/store.ts`. If the UI is not reflecting backend changes, the store is likely out of sync.

### Key Stores:
- **`useAuthStore`**: Manages `currentUser`, `users` array, `login()`, `register()`, `logout()`. 
- **`usePropertyStore`**: Manages `properties` array, filtering logic, and CRUD operations for listings.
- **`useInspectionStore`**: Manages property viewing requests (`inspectionRequests`).
- **`useRentalStore`**: Manages active/historical `rentals`.

***Bug Tracing Tip:*** *If data saves to the database but doesn't show in the UI, verify that the zustand store's `set()` method was called after the successful API fetch inside `store.ts`.*

---

## 4. UI Views Breakdown (`src/views/`)
Every major feature corresponds to a specific view component.

### Tenant Features
- **`tenant-dashboard.tsx`**: Search properties, general overview.
- **`tenant-property-detail.tsx`**: Full property view, "Book Inspection" and "Make Offer" options.
- **`tenant-inspections.tsx`**: Track viewing requests.
- **`tenant-rentals.tsx`**: View active leases and agreements.

### Landlord Features
- **`landlord-dashboard.tsx`**: Portfolio overview, manage incoming requests.
- **`landlord-property-form.tsx`**: Form to create/edit property listings.

### Solicitor Features
- **`solicitor-dashboard.tsx`**: Review properties assigned for verification, add legal notes.

### Admin Features
- **`admin-dashboard.tsx`**: System overview, manage users, CMS (Terms, About us).

### Shared & Auth
- **`login-page.tsx` / `register-page.tsx`**: Authentication UI.

---

## 5. Backend API Routes (`src/app/api/`)
The Next.js route handlers process database requests. They communicate directly with Prisma.

### Where to look for API bugs:
- **Database Connection**: `src/lib/db.ts` creates the Prisma client.
- **Endpoints**: Look inside `src/app/api/[resource]/route.ts`.
  - e.g., `/api/auth/login/route.ts` handles credential checks.
  - e.g., `/api/properties/route.ts` handles fetching, POSTing, PATCHing properties.

***Bug Tracing Tip:*** *If a 500 server error occurs, it is usually a Prisma query failure in one of these route handlers. Check your automated logs.*

---

## 6. Global Error Handling & Automated Logging
To automate bug tracing, a unified logging system is implemented:

1. **Server-Side Logistics**: Errors in API routes are captured by a custom logger (`src/lib/logger.ts`) and appended to `tmp/app.log`.
2. **Client-Side Errors**: A Global Error Boundary (`src/components/global-logger.tsx`) catches React render errors and sends them to `/api/logs` to be recorded.
3. **Log File Location**: Check `tmp/app.log` for a continuous timestamped record of all errors, which makes tracing specific crashes straightforward.
