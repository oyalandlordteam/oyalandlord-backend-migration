# 🏠 OyaLandlord

A modern, production-ready real estate and rental management platform designed to streamline interactions between tenants, landlords, solicitors, and admins. 

## ✨ Key Features

### 👤 For Tenants
- **Property Search**: Advanced filtering by location, price, and property type.
- **Inspection Requests**: Book and manage property viewings with integrated screening questions.
- **Offer Management**: Make bids and negotiate rental prices directly.
- **Rentals & Agreements**: View active rentals and download signed agreements.

### 🏢 For Landlords & Managers
- **Property Management**: List and manage properties with rich media support.
- **Rental Agreements**: Generate professional rental agreements with customizable terms.
- **Dashboard**: Real-time stats on views, bids, and active rentals.
- **Screening**: Set custom screening questions for each property.

### ⚖️ For Solicitors
- **Inspection Verification**: Professional queue for verifying property conditions.
- **Documentation**: Add notes and verify tenant screening answers.

### 🛡️ For Admins
- **Content Management**: Manage FAQs, About Us, and Terms & Conditions.
- **User Management**: Overview of all platform participants.
- **System Stats**: Live monitoring of platform activity.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), TypeScript 5, Tailwind CSS 4.
- **UI Components**: shadcn/ui (Radix UI), Lucide Icons, Framer Motion.
- **State/Data**: Zustand, TanStack Query.
- **Forms**: React Hook Form + Zod.
- **Backend/DB**: Prisma ORM with SQLite (standard).
- **Styling**: Modern dark mode support via Next Themes.

---

## 🚀 Getting Started

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   The project uses SQLite and Prisma. Initialize the database and seed it with mock data:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

3. **Start the Dev Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) to view the app.

---

## 🐳 Docker Deployment

The project is optimized for containerized deployment with persistent storage.

### Using Docker Compose (Recommended)
To run the full stack (App + Persistent Database):
```bash
docker-compose up --build -d
```
The database will be persisted in `./prisma/dev.db` on your host machine.

### Using Docker Standalone
1. **Build the image**:
   ```bash
   docker build -t oyalandlord .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3001:3001 oyalandlord
   ```

---

## 📁 Project Structure

```
src/
├── app/          # Main App Router & entry points
├── views/        # Shared view components (Dashboard, Forms, Profiles)
├── components/   # Reusable UI components (shadcn/ui)
├── hooks/        # Custom business logic hooks
└── lib/          # Global types, store, and utilities
```

---

Built for the Nigerian real estate market with ❤️.
