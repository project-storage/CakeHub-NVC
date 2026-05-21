# 🎂 Orders Cake Management System

A modernized, high-performance full-stack application for managing cake orders, student groups, and academic departments. This project features a robust **NestJS** backend and a sleek **Next.js 15** frontend, orchestrated with **Docker**.

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Secure access for Admins, Advisors, and Users.
- **Order Management:** Track cake orders, deposits, and delivery statuses.
- **Analytics Dashboard:** Visual insights into sales, revenue, and popular products using ECharts.
- **Student & Group Tracking:** Manage students, academic groups, degrees, and departments.
- **Automated Auth Flow:** Seamless JWT handling with automatic token refreshing.
- **Developer Friendly:** Fully typed with TypeScript, documented with Swagger, and containerized.

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS (v11+)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Security:** Passport.js (JWT + Refresh), Helmet, Rate Limiting
- **API Docs:** Swagger UI

### Frontend
- **Framework:** Next.js 15 (App Router)
- **State:** Zustand
- **Data Fetching:** TanStack Query v5 + Ky
- **UI Components:** shadcn/ui + Tailwind CSS 4
- **Charts:** ECharts

---

## 🏃 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20+](https://nodejs.org/) (for local development)

### Quick Start with Docker
The easiest way to get the system running is using Docker Compose:

```bash
docker-compose up --build
```

- **Frontend:** [http://localhost:3001](http://localhost:3001)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)
- **Swagger Documentation:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 📂 Project Structure

```text
.
├── frontend-next/     # Next.js 15 Frontend
├── nest-backend/      # NestJS Backend
├── docker-compose.yml # Docker orchestration
├── GEMINI.md          # Internal development guide
└── MIGRATION_STRATEGY.md # Legacy to Modern migration notes
```

### Manual Development Setup

#### 1. Backend
```bash
cd nest-backend
npm install
# Configure your .env file
npx prisma migrate dev
npm run start:dev
```

#### 2. Frontend
```bash
cd frontend-next
npm install
# Ensure NEXT_PUBLIC_API_URL is set in .env.local
npm run dev
```

---

## 🛡️ Security & Conventions

- **API Prefix:** All backend routes are prefixed with `/api`.
- **Validation:** Global `ValidationPipe` ensures all incoming data matches DTO schemas.
- **Interceptors:** Frontend `apiClient` automatically handles 401 errors by attempting a token refresh.

## 📄 License
This project is for educational/private use. See `package.json` for licensing details.
