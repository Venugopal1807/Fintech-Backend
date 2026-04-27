# FinTech Backend

A rigorous and secure backend system for financial data processing, access control, and dashboard aggregations.

## Overview
This platform securely manages financial records tied to an organization, utilizing strict Role-Based Access Control (RBAC) to separate responsibilities. It features a scalable architecture that calculates critical dashboard aggregations natively at the database level to optimize performance.

## Technical Stack
- **Runtime Component:** Node.js (v18+)
- **Language:** TypeScript
- **Web Framework:** Express.js
- **Database Engine:** PostgreSQL (Neon Serverless)
- **ORM / Types:** Prisma (v5.22.0)
- **Input Validation:** Zod
- **Security Protocols:** JWT Authentication, Bcrypt Password Hashing

## Architectural Decisions
- **Singleton Pattern:** The Prisma client strictly utilizes a singleton pattern (`src/lib/prisma.ts`), eliminating multiple initialization instances and protecting the application from PostgreSQL connection pool exhaustion.
- **Repository/Service Pattern:** The architecture relies on robust decoupled layers. Data models are strictly contained within their respective service layers (`src/services/`) and separated from request routing arrays/controllers. 
- **RBAC Logic:** Security is modeled inside custom route middlewares, intercepting requests to enforce permissions depending on decoded token data before passing them downstream.
- **Native Database Aggregation:** Operations like calculating income, expenses, and grouped categories operate completely inside the Prisma Aggregation engines (`_sum` and `groupBy`) ensuring O(1) performance in the Node runtime regardless of data scale.

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database Connection String

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Reference `.env.example` or create a `.env` file at the root:
```env
# Database Credentials
DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<database>?sslmode=require"

# Security
JWT_SECRET="super_secret_minimum_32_characters_key"
PORT=3000
```

### 3. Generate the Database Client
```bash
npx prisma generate
```

### 4. Seed the Database
Deploy starting users via the bundled script:
```bash
npx prisma db seed
```

#### Seed Credentials Provided:
- **Admin:** `admin@zorvyn.io` | Password: `Test@1234`
- **Analyst:** `analyst@zorvyn.io` | Password: `Test@1234`
- **Viewer:** `viewer@zorvyn.io` | Password: `Test@1234`

### 5. Start the Application
For local development utilizing auto-reload:
```bash
npm run dev
```

## API Endpoints Reference

### Authentication
| Method | Path               | Role Required | Description                                      |
| ------ | ------------------ | ------------- | ------------------------------------------------ |
| `POST` | `/api/auth/login`  | (Public)      | Authenticates credentials & fetches a JWT Token. |

### Financial Records
| Method   | Path               | Role Required     | Description                                |
| -------- | ------------------ | ----------------- | ------------------------------------------ |
| `GET`    | `/api/records`     | ANY AUTHENTICATED | Fetch and view basic records dynamically.  |
| `POST`   | `/api/records`     | ADMIN, ANALYST    | Generate a new financial record.           |
| `PUT`    | `/api/records/:id` | ADMIN, ANALYST    | Fully target and update an active record.   |
| `DELETE` | `/api/records/:id` | ADMIN             | Perform a soft-delete on a target record.  |

### Dashboard Metrics
| Method | Path                              | Role Required             | Description                                     |
| ------ | --------------------------------- | ------------------------- | ----------------------------------------------- |
| `GET`  | `/api/dashboard/summary`          | VIEWER, ANALYST, ADMIN    | Provides totals for Income, Expenses & Balance. |
| `GET`  | `/api/dashboard/category-breakdown`| VIEWER, ANALYST, ADMIN  | Aggregates total performance categorized data.  |

### User Management
| Method   | Path             | Role Required | Description                                   |
| -------- | ---------------- | ------------- | --------------------------------------------- |
| `GET`    | `/api/users`     | ADMIN         | Scans and outputs the raw list of all users.  |
| `POST`   | `/api/users`     | ADMIN         | Register a new internal system user account.  |
| `PATCH`  | `/api/users/:id` | ADMIN         | Alters metadata (e.g. status) on a known user.|
