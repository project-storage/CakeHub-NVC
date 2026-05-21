# NestJS Migration Strategy

## 1. Overview
The current backend is a monolithic Express.js application using Sequelize with MySQL. The target architecture is a modular NestJS application using Prisma ORM with PostgreSQL, written in TypeScript. 

### Why migrate?
- **Maintainability:** NestJS enforces a modular, opinionated architecture based on SOLID principles, which makes the codebase much easier to scale and maintain.
- **Type Safety:** Moving from plain JavaScript/Sequelize to TypeScript/Prisma ensures compile-time type safety across the database and application layer.
- **Performance:** PostgreSQL provides robust features for advanced queries and data integrity, while Prisma optimizes query execution.

## 2. Refactoring Architecture

We will adopt a **Feature Module Pattern**. Each domain entity (Auth, Users, Orders, Cakes, Teams, etc.) will have its own module containing:
- `dto/` (Data Transfer Objects for validation)
- `entities/` (Types/Interfaces for the domain)
- `*.controller.ts` (Handling HTTP requests)
- `*.service.ts` (Business logic)
- `*.module.ts` (Dependency injection configuration)

The global structure will be:
```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── students/
│   ├── teams/
│   ├── degrees/
│   ├── departments/
│   ├── groups/
│   ├── cakes/
│   ├── orders/
│   └── status/
├── common/
│   ├── guards/
│   ├── interceptors/
│   ├── decorators/
│   ├── filters/
│   └── middleware/
├── config/
├── prisma/
├── health/
├── app.module.ts
└── main.ts
```

## 3. Database Migration
We will convert Sequelize models to a `schema.prisma` file, translating the relationships (One-to-One, One-to-Many, Many-to-Many) correctly.

**Key Conversion Changes:**
- Sequelize `tb_user` -> Prisma `User`
- Sequelize `tb_student` -> Prisma `Student`
- Sequelize `tb_team` -> Prisma `Team`
- Sequelize `tb_memberTeam` -> Prisma `TeamMember`
- Sequelize `tb_degree` -> Prisma `Degree`
- Sequelize `tb_department` -> Prisma `Department`
- Sequelize `tb_group` -> Prisma `Group`
- Sequelize `tb_cake` -> Prisma `Cake`
- Sequelize `tb_order` -> Prisma `Order`
- Sequelize `tb_orderDetail` -> Prisma `OrderDetail`
- Sequelize `tb_status` -> Prisma `Status`

## 4. Authentication Refactor
We will replace the existing Express Passport setup with `@nestjs/passport` and `@nestjs/jwt`.
- **JWT Access Token:** Short-lived access token for API requests.
- **Refresh Token:** To securely request new access tokens without re-authenticating.
- **Guards:** `JwtAuthGuard` to protect routes, and `RolesGuard` to handle Role-Based Access Control (RBAC).

## 5. Security & Error Handling
- **Security:** We will use `helmet`, `cors`, and `express-rate-limit` wrapped in NestJS's idiomatic way.
- **Error Handling:** We will implement a global `AllExceptionsFilter` to catch all unhandled errors and format them in a standard API response:
  ```json
  {
    "success": false,
    "message": "Error Message",
    "errors": []
  }
  ```
- **Validation:** We will use `ValidationPipe` globally with `class-validator` and `class-transformer`.

## 6. API Documentation & DevOps
- **Swagger:** Built-in `@nestjs/swagger` integration to generate OpenAPI specs automatically.
- **Docker:** A `Dockerfile` and `docker-compose.yml` for local development (including PostgreSQL and the API).

## 7. Migration Steps
1. **Initialize NestJS** project.
2. **Setup Prisma** and PostgreSQL (generate schema and migrations).
3. **Setup Global Config**, Validation, Filters, and Interceptors.
4. **Implement Modules** incrementally:
   - `HealthModule`
   - `AuthModule` & `UsersModule`
   - `DegreesModule`, `DepartmentsModule`, `GroupsModule`
   - `CakesModule`, `StatusModule`
   - `StudentsModule`, `TeamsModule`
   - `OrdersModule`
5. **Dockerize** the application.
6. **Testing** (Unit & E2E).
