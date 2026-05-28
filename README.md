# 🎂 CakeHub: Enterprise Cake Management System

An elegant, modern, and responsive Cake Booking & Student Management System designed for enterprise-grade operations (Enterprise Edition 2026).

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS 11](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

---

## 🌟 Key Features

### 🎨 Modern & Responsive UI
- **Refined Layout:** Fully redesigned from scratch with a premium aesthetic, featuring clean layouts, balance spaces, subtle shadows, and smooth transitions inspired by Stripe and Linear interfaces.
- **Fully Responsive:** Offers a flawless experience across Desktop, Tablet, and Mobile devices with a smart Sidebar Drawer on mobile screens.
- **Bakery Premium Aesthetic:** Sophisticated color palettes designed specifically to reflect a high-end bakery experience.

### 🛍️ Premium Storefront (For Customers)
- **Browse & Filter:** Allows quick cake catalog browsing with instant pound-size filters (Personal 1LB, Medium 2LB, Party 3LB+).
- **Zustand Cart Drawer:** A slide-over cart drawer that calculates total prices, deposit amounts, and remaining balances instantly while enforcing strict stock checks.
- **Seamless Checkout:** Intelligently linked with the student database. It automatically retrieves existing student profiles or signs them up on-the-fly without interrupting the payment workflow.
- **Live Visual Tracking:** Beautifully animated order timeline with five sequential tracking states (`PENDING` ➔ `DEPOSITED` ➔ `PAID` ➔ `DELIVERED` ➔ `CANCELLED`).

### 👨‍🏫 Advisor Specialization (For Advisors)
- **Data Isolation:** Teachers/advisors only see student details and order data belonging to their assigned classroom to protect privacy and data integrity.
- **Student Management:** Manage (CRUD) students inside their respective classroom groups directly.
- **Booking Mastery:** Place cake bookings on behalf of students, track deposits, and monitor payment statuses in real-time.
- **Classroom Insights:** A personalized classroom dashboard showing real-time statistics (total reservations, popular cakes, and outstanding balances).

### 👑 Central Administrator Control (For Admins)
- **User Management CRUD:** Complete admin interface to create, search, update, and suspend/delete system accounts (Admin, Advisor, User).
- **Global Settings & References:** Easily manage institutional reference data including classes (Groups), departments (Departments), and education levels (Degrees).
- **Catalog Management:** Full inventory control over the bakery catalog (Cakes Inventory) including pricing, stock quantities, and sizes.
- **Omni Dashboard:** Institution-wide analytics showing total bookings, payments, and cake preparation statuses across all classrooms.

### 📄 Document & Verification
- **Printable Receipts:** Generate official, beautifully formatted printable booking receipts with designated signature fields for students and advisors.
- **Audit Ready:** Complete lifecycle tracking for orders and financial reports with slip verification attachments.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Core** | Next.js 16 (App Router), TypeScript, Zustand (Persistent Cart & Session), TanStack Query v5 |
| **API Client** | Ky Wrapper (Centralized interceptors, retry policy, 401 automatic token rotation) |
| **Forms & Validation** | React Hook Form, Zod validation |
| **Styling** | Tailwind CSS 4, shadcn/ui, Lucide Icons, Glassmorphism filters |
| **Backend Core** | NestJS 11, TypeScript, Passport JWT (Access + Refresh Token) |
| **Database** | PostgreSQL + Prisma ORM (Configured for Supabase with connection pooling) |
| **Infrastructure** | Docker, Docker Compose |

---

## 🏃 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 20+ (if running manually)

### Launching the Application with Docker
1. Clone this repository to your local machine.
2. Run the following command in your terminal to spin up the production build:

```bash
docker-compose up --build
```

- **Premium Customer Storefront (Redirects to Login):** [http://localhost:3001](http://localhost:3001)
- **Advisor/Admin Dashboard:** [http://localhost:3001/dashboard](http://localhost:3001/dashboard)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)
- **Swagger Documentation:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

### 🔑 Test Credentials

To test different role scopes and permissions, use the credentials below (the default password is `password123` for all accounts):

| Role | Email | Permissions / Features |
| :--- | :--- | :--- |
| **👑 Administrator** | `admin@example.com` | Full system access. Manage users, classrooms, departments, cake inventories, and view global dashboards. |
| **👨‍🏫 Advisor (Teacher 1)**| `advisor1@example.com` | Classroom-specific access. Manage students and bookings inside their own group with dedicated room analytics. |
| **👨‍🏫 Advisor (Teacher 2)**| `advisor2@example.com` | Separate advisor access. Fully isolated data from Teacher 1. |
| **👤 Regular User (Customer 1)** | `user1@example.com` | Place bookings on the storefront, modify cart items, upload payment slips, and track orders. |
| **👤 Regular User (Customer 2)** | `user2@example.com` | Normal customer booking and reservation tracking. |

---

## ⚡ Development & Hot-Reload Guide

For the fastest developer experience without having to rebuild docker containers on every save:

### Method 1: Docker Database + Local Running Apps (Highly Recommended 🚀)
This approach triggers hot-reloading in less than a second:

1. **Spin up ONLY the PostgreSQL database on Docker:**
   ```bash
   docker-compose up postgres
   ```
2. **Run the Backend (NestJS) in development mode:**
   Open a new terminal window, navigate to `nest-backend`, and run:
   ```bash
   cd nest-backend
   npm run start:dev
   ```
3. **Run the Frontend (Next.js) in development mode:**
   Open another terminal window, navigate to `frontend-next`, and run:
   ```bash
   cd frontend-next
   npm run dev
   ```

---

### Method 2: Docker Volume Mounts (Run Everything inside Docker)
If you prefer running everything in Docker, you can mount volume paths in `docker-compose.yml` to automatically sync files:

1. Modify `docker-compose.yml` under both `backend` and `frontend` services:
   ```yaml
     backend:
       # ...
       volumes:
         - ./nest-backend:/app
         - /app/node_modules
       command: npm run start:dev

     frontend:
       # ...
       volumes:
         - ./frontend-next:/app
         - /app/node_modules
         - /app/.next
       command: npm run dev
   ```
2. Spin up the setup:
   ```bash
   docker-compose up --build
   ```

---

## 📂 Project Structure

```text
.
├── frontend-next/     # Next.js 16 Frontend (App Router + Zustand + Ky)
│   ├── src/
│   │   ├── app/        # Page routes (Storefront & Dashboard)
│   │   ├── components/ # Presentational shared UI (Cart, Cake, Checkout, Forms, Layout)
│   │   ├── lib/        # Centralized Ky API clients
│   │   ├── store/      # Zustand state engines
│   │   └── services/   # Type-safe API request services
├── nest-backend/      # NestJS 11 Backend (API)
│   ├── src/
│   │   ├── supabase/   # Reusable Supabase SDK client module
│   │   ├── prisma/     # Global Prisma Service module
│   │   └── ...         # Feature modules (cakes, orders, auth, users, etc.)
├── docker-compose.yml # Docker Orchestration
└── README.md          # Project guide
```

---

## 🔐 Security & Optimization

- **RBAC (Role-Based Access Control):** Role validation guards applied on all backend endpoints (Admin, Advisor, User).
- **Validation:** Strict validation rules implemented via `class-validator` (Backend) and `Zod` (Frontend) ensuring data accuracy.
- **Sanitization:** Passwords and other sensitive fields are safely filtered out of all API response payloads.
- **Centralized Security Client:** Seamless automatic handling of access/refresh JWT tokens and session rotation via Ky API client interceptors.

---

## 📄 License
This project is created for internal and educational purposes only. For dependency specifics, refer to the `package.json` file in their respective directories.
