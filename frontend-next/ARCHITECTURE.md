# Next.js 15 Frontend Architecture Redesign

This document outlines the modern, scalable, and highly performant frontend architecture for the **Orders Cake** application. We are migrating from a legacy Vite + React + Redux stack to Next.js 15 (App Router), adopting the latest React paradigms including Server Components, modern state management, and an updated styling ecosystem.

---

## 1. New Frontend Architecture

**Core Framework**: **Next.js 15 (App Router)**
- **Routing**: Utilize App Router for nested layouts, route groups (e.g., `(auth)`, `(dashboard)`), and parallel/intercepting routes.
- **Rendering Strategy**: Prioritize **React Server Components (RSC)** by default. Fetch data on the server to reduce client payload. Opt-in to Client Components (`"use client"`) strictly for interactive features, forms, and hooks.
- **Data Fetching**: Streaming rendering with `<Suspense>` boundaries. Use Next.js extended `fetch` with revalidation for SSG/ISR, alongside TanStack Query for dynamic client-side interactions.

**State Management Split**:
- **Server State**: **TanStack Query (React Query v5)** handles data fetching, caching, synchronization, optimistic updates, and infinite scrolling.
- **Client State**: **Zustand** replaces Redux Toolkit for UI states (e.g., sidebar toggles, theme, modal visibility) and synchronous global state.

**Styling & UI**:
- **TailwindCSS v4**: Utility-first CSS with CSS variables and design tokens for a performant mobile-first layout.
- **shadcn/ui**: Accessible, headless Radix UI components layered with Tailwind for maximum reusability and customizability.

---

## 2. Folder Structure

The project will adopt a feature-based structure intertwined with Next.js App Router conventions:

```text
src/
├── app/                      # Next.js App Router (Pages & Layouts)
│   ├── (auth)/               # Route Group: login, register
│   ├── dashboard/            # SuperAdmin/Admin Dashboard
│   ├── orders/               # Order management pages
│   ├── cakes/                # Cake inventory management
│   ├── students/             # Student management
│   ├── groups/               # Group management
│   ├── reports/              # Analytics and charts
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/               # Shared UI Components
│   ├── ui/                   # shadcn/ui base components (Button, Input, etc.)
│   ├── forms/                # Reusable form components & wrappers
│   ├── charts/               # Apache ECharts wrapper components
│   ├── layout/               # Header, Sidebar, Footer components
│   └── tables/               # TanStack Table implementations
├── features/                 # Feature-sliced modules containing business logic
│   ├── auth/                 # Auth hooks, API, components
│   ├── orders/               # Orders API, store slices, custom components
│   ├── cakes/                # Cakes logic
│   └── dashboard/            # Dashboard specific logic
├── services/
│   └── api/                  # Native Fetch / Ky wrapper and interceptors
├── store/                    # Zustand stores (e.g., useAuthStore.ts, useUIStore.ts)
├── hooks/                    # Global generic React hooks
├── providers/                # React Context Providers (QueryClient, ThemeProvider)
├── types/                    # Global TypeScript type definitions
├── models/                   # Zod schemas mapping to business entities
├── utils/                    # Helper functions (formatting, math, etc.)
├── constants/                # App-wide constants (config, routes)
└── middleware.ts             # Next.js Middleware for Auth / Route Protection
```

---

## 3. Model Design

All models are strictly defined using **Zod** to enable type inference and runtime validation. This guarantees end-to-end type safety from API response to form submission.

```typescript
// src/models/Cake.ts
import { z } from "zod";

export const CakeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});

export type Cake = z.infer<typeof CakeSchema>;
```

Entities will be mapped across: `Auth`, `User`, `Cake`, `Degree`, `Department`, `Group`, `Order`, `Status`, `Student`, `Team`.

---

## 4. UI Design System

- **Component Library**: **shadcn/ui** acts as the baseline. We generate components (buttons, dialogs, dropdowns) directly into `src/components/ui`.
- **Accessibility**: Built on **Radix UI** primitives, ensuring keyboard navigation, screen reader support, and ARIA compliance.
- **Theming**: **next-themes** manages dark/light mode switching. Colors are defined as CSS variables in `globals.css` and mapped in the `tailwind.config.ts` (or Tailwind v4 equivalent).

```css
/* src/app/globals.css */
@theme {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
  }
  .dark {
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
  }
}
```

---

## 5. API Layer Design

Replaced Axios with **Ky** (or a smart Native Fetch wrapper) for a smaller footprint and modern features.

- **Features**: Automatic retries on 5xx, timeout configurations, and interceptors for adding Bearer tokens or handling 401s (refresh token rotation).

```typescript
// src/services/api/client.ts
import ky from 'ky';
import { useAuthStore } from '@/store/useAuthStore';

export const apiClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      request => {
        const token = useAuthStore.getState().token;
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // trigger refresh token logic or logout
        }
      }
    ]
  }
});
```

---

## 6. State Management Design

**Zustand (Client State)**
Handles lightweight, UI-specific state and synchronously accessed Auth tokens.
```typescript
// src/store/useUIStore.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

**TanStack Query (Server State)**
Handles caching, refetching, and optimistic updates.
```typescript
// src/features/cakes/hooks/useCakes.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { Cake } from '@/models/Cake';

export const useCakes = () => {
  return useQuery({
    queryKey: ['cakes'],
    queryFn: () => apiClient.get('api/cakes').json<Cake[]>(),
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });
};
```

---

## 7. Component Structure

Adopt a **Container/Presenter** pattern fused with **Server/Client Components**.
- **Page (`page.tsx`)**: Server Component. Fetches initial data (or dehydrates state for TanStack query) and handles SEO metadata.
- **Client Wrapper**: Contains interactivity (`"use client"`).
- **UI Primitives**: Dumb components styled with Tailwind.

```tsx
// src/app/cakes/page.tsx (Server Component)
import { Suspense } from 'react';
import { CakeList } from '@/features/cakes/CakeList';
import { Skeleton } from '@/components/ui/skeleton';

export default function CakesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Cakes</h1>
      <Suspense fallback={<Skeleton className="w-full h-96" />}>
        <CakeList /> {/* Client Component with TanStack Query */}
      </Suspense>
    </div>
  );
}
```

---

## 8. Dashboard Design

Replaced Chart.js with **Apache ECharts** for robust, high-performance visualizations capable of rendering thousands of data points smoothly.

- **Dynamic Loading**: ECharts is a large library. It will be loaded dynamically using Next.js `next/dynamic` to keep the initial page bundle lean.
- **Visuals**: Sales metrics, Top Selling Cakes, Performance Metrics.

```tsx
// src/components/charts/DashboardChart.tsx
'use client';
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const DashboardChart = ({ data }) => {
  const options = { /* ECharts config */ };
  return <ReactECharts option={options} />;
};
```

---

## 9. Form Architecture

**React Hook Form + Zod + shadcn/ui**
Provides type-safe, performant forms without unnecessary re-renders.

- **Validation**: Schema validation is handled entirely by Zod.
- **Feedback**: **Sonner** handles toast notifications upon submission success or error.

```tsx
// Example Snippet
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CakeSchema, Cake } from "@/models/Cake";

const form = useForm<Cake>({
  resolver: zodResolver(CakeSchema),
});
```

---

## 10. Authentication Flow

- **Next.js Middleware**: `src/middleware.ts` intercepts requests. If a user is not authenticated and tries to access `/dashboard` or `/orders`, they are redirected to `/login`.
- **JWT & Cookies**: The backend sends JWTs inside `HttpOnly` cookies for maximum security against XSS. Alternatively, manage short-lived access tokens via Zustand + `Ky` interceptors if cookies are not fully supported by the API design.
- **RBAC**: Protected routes layout fetches user role context and checks if the role (e.g., SuperAdmin, Teacher, Student) has permission to view the component.

---

## 11. Performance Optimization Plan

- **Server Component First**: Offload JS from the client. Render heavy layouts and initial data fetching on the server.
- **Code Splitting & Dynamic Imports**: Use `next/dynamic` for heavy client features: ECharts, complex modal dialogues, TanStack Table instances.
- **Image Optimization**: Replace static `<img>` tags with Next.js `next/image` to automatically serve WebP/AVIF, lazy load, and prevent Layout Shift.
- **Framer Motion**: Keep animations lightweight. Use `Motion` for simple micro-interactions and route transitions, wrapping them in separate Client Components to avoid polluting server components.
- **Bundle Analysis**: Utilize `@next/bundle-analyzer` in the build process to monitor chunks.

---

## 12. Production Ready Code Structure

- **Error Handling**: Use Next.js `error.tsx` for granular route error boundaries, preventing entire app crashes.
- **Not Found**: Custom `not-found.tsx` layouts.
- **Linting & Formatting**: Enforced via ESLint (strict mode) and Prettier.
- **Git Hooks**: Husky + lint-staged to ensure no unformatted or TypeScript-error-ridden code is committed.
- **Table Virtualization**: **TanStack Table** integrated with `@tanstack/react-virtual` for tables exceeding 100+ rows (e.g., student lists, massive order histories) to maintain a steady 60fps.

---
*End of Architecture Blueprint*