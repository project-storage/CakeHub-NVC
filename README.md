# 🎂 CakeHub: Enterprise Cake Management System

ระบบบริหารจัดการสั่งจองเค้กและข้อมูลนักเรียน (Cake Booking & Student Management System) ที่ออกแบบมาให้มีความทันสมัย ใช้งานง่าย และรองรับการทำงานในระดับองค์กร (Enterprise Edition 2026)

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS 11](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

---

## 🌟 จุดเด่นของระบบ (System Highlights)

### 🎨 Modern & Responsive UI
- **Refined Layout:** หน้าจอถูกออกแบบใหม่ทั้งหมดในสไตล์ "Premium" เน้นความสะอาดตา (Clean Design) และความลื่นไหลในการใช้งานสไตล์ Stripe และ Linear
- **Fully Responsive:** รองรับการใช้งานสมบูรณ์แบบทั้งบน Desktop, Tablet และ Mobile พร้อม Sidebar แบบ Smart Drawer สำหรับหน้าจอมือถือ
- **Bakery Premium Aesthetic:** ชุดเฉดสีและการออกแบบที่สะท้อนถึงเบเกอรี่ระดับพรีเมียม สเปซสมดุล เงาบางเบา และปุ่มกดที่ลื่นไหล

### 🛍️ ระบบหน้าร้านค้าสำหรับลูกค้าทั่วไป (Premium Storefront)
- **Browse & Filter:** หน้าแรกสำหรับการเลือกซื้อเค้ก รองรับการค้นหารวมถึงการกรองขนาดปอนด์ (Personal 1LB, Medium 2LB, Party 3LB+) แบบทันใจ
- **Zustand Cart Drawer:** ตะกร้าสินค้าด้านข้างแบบสไลด์ (Slide-over Sheet) คำนวณราคาสุทธิ มัดจำ และยอดค้างจ่ายทันที ป้องกันการกดเกินจำนวนในคลังสินค้า (Stock checking)
- **Seamless Checkout:** ฟอร์มสั่งซื้อที่เชื่อมโยงกับฐานข้อมูลนักเรียนอย่างอัจฉริยะ ค้นหาประวัตินักเรียนอัตโนมัติ หากไม่มีในระบบจะทำการสมัครให้ออนเดอะฟลายโดยไม่รบกวนขั้นตอนการชำระเงิน
- **Live Visual Tracking:** ไทม์ไลน์ติดตามความคืบหน้าการทำเค้ก (Order Timeline) 5 ขั้นตอน (`PENDING` ➔ `DEPOSITED` ➔ `PAID` ➔ `DELIVERED` ➔ `CANCELLED`) แบบมีแอนิเมชันจุดนำสายตา

### 👨‍🏫 ระบบสำหรับครูที่ปรึกษา (Advisor Specialization)
- **Data Isolation:** ครูที่ปรึกษาจะเห็นเฉพาะข้อมูลนักเรียนและออเดอร์ใน "ห้องเรียนที่ตนเองดูแล" เท่านั้น เพื่อความเป็นส่วนตัวและความถูกต้องของข้อมูล
- **Student Management:** สามารถ เพิ่ม ลบ และแก้ไขข้อมูลนักเรียนในกลุ่มที่รับผิดชอบได้โดยตรง
- **Booking Mastery:** ทำรายการสั่งจองเค้กแทนนักเรียน ตรวจสอบยอดเงินมัดจำ และติดตามสถานะการชำระเงินได้แบบ Real-time
- **Classroom Insights:** Dashboard ส่วนตัวที่จะแสดงสถิติเฉพาะห้องเรียนที่ดูแล (ยอดจองรวม, เค้กที่ได้รับความนิยม, ยอดเงินคงเหลือ)

### 📄 Document & Verification
- **Printable Receipts:** ระบบสามารถสั่งพิมพ์ใบสั่งจองเค้ก (Official Receipt) ออกมาเป็นรูปแบบเอกสารที่สวยงาม พร้อมพื้นที่สำหรับลายเซ็นนักเรียนและครูที่ปรึกษา
- **Audit Ready:** ระบบจัดการสถานะออเดอร์และบันทึกรายงานการเงินพร้อมแนบสลิปผ่านทางหน้าร้าน

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| Component | Technology |
| :--- | :--- |
| **Frontend Core** | Next.js 16 (App Router), TypeScript, Zustand (Persistent Cart & Session), TanStack Query v5 |
| **API Client** | Ky Wrapper (Centralized interceptors, retry policy, 401 automatic token rotation) |
| **Forms** | React Hook Form, Zod schemas validation |
| **Styling** | Tailwind CSS 4, shadcn/ui, Lucide Icons, glassmorphism filters |
| **Backend Core** | NestJS 11, TypeScript, Passport JWT (Access + Refresh Token) |
| **Database** | PostgreSQL + Prisma ORM |
| **Infrastructure** | Docker, Docker Compose |

---

## 🏃 การเริ่มต้นใช้งาน (Getting Started)

### ความต้องการของระบบ (Prerequisites)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Node.js 20+ (หากต้องการรันแบบ Manual)

### เริ่มต้นรันระบบด้วย Docker (Quick Start)
1. Clone โปรเจคลงในเครื่อง
2. รันคำสั่งต่อไปนี้ใน Terminal:

```bash
docker-compose up --build
```

- **Premium Customer Storefront:** [http://localhost:3001](http://localhost:3001)
- **Advisor/Admin Dashboard:** [http://localhost:3001/dashboard](http://localhost:3001/dashboard)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)
- **Swagger Documentation:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 📂 โครงสร้างโปรเจค (Project Structure)

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
├── docker-compose.yml # Docker Orchestration
└── README.md          # คู่มือระบบสารสนเทศ
```

---

## 🔐 ข้อมูลความปลอดภัย (Security)

- **RBAC:** ระบบมีการตรวจสอบสิทธิ์ตามบทบาท (Admin, Advisor, User) ในทุก Endpoint
- **Validation:** ใช้ Class Validator (Backend) และ Zod (Frontend) เพื่อความถูกต้องของข้อมูล 100%
- **Sanitization:** กรองข้อมูลที่มีความสำคัญ (เช่น รหัสผ่าน) ออกจาก Response เสมอ
- **Centralized Security Client:** บริหารจัดการส่ง JWT Token และต่ออายุ Session ทรานแซกชันอย่างปลอดภัยผ่าน Ky Interceptor

## 📄 ใบอนุญาต (License)
โปรเจคนี้จัดทำขึ้นเพื่อการใช้งานภายใน/การศึกษาเท่านั้น สำหรับรายละเอียดเพิ่มเติมสามารถดูได้ที่ `package.json` ของแต่ละ Module
