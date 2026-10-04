# Project KEYSTONE — Field Service Management Platform

[![Spring Boot 3](https://img.shields.io/badge/Spring_Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

An end-to-end, enterprise-grade **Field Service Management Platform** built for commercial facilities operations (HVAC, electrical, plumbing, and structural maintenance). Built with **Spring Boot 3 (Java 21)**, **React + TypeScript + Vite**, and **PostgreSQL**.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC) & JWT Security**:
   - Four distinct user roles: **Manager**, **Dispatcher**, **Technician**, and **Customer**.
   - Stateless JWT authentication, BCrypt password hashing, method-level authorization (`@PreAuthorize`).
2. **Work Order Lifecycle & Kanban Board**:
   - Full state machine transition: `NEW` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `COMPLETED` (or `ON_HOLD` / `CANCELLED`).
   - Drag-and-drop / Kanban workflow with real-time audit trail and status change history.
3. **Automated SLA Breach Engine**:
   - Priority-based SLA resolution time calculations (Critical: 4 hrs, High: 24 hrs, Medium: 48 hrs, Low: 7 days).
   - Automated background scheduler (`@Scheduled`) continuously auditing active work orders and flagging SLA breaches.
4. **Technician Mobile Field Tools**:
   - Field labor time logging (minutes spent, detailed work log notes).
   - Inventory spare parts consumption logging with automated on-hand inventory deduction.
5. **Customer & Multi-Site Hierarchy**:
   - Multi-tenant customer directory with multiple building/site locations per customer.
   - Customers can create and track their own work orders.
6. **Executive Analytics & Operational KPI Dashboard**:
   - High-level KPIs: Active orders, SLA breach rates, all-time parts expense, total technician labor hours.
   - Status and priority breakdown charts + technician active workload distribution.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Axios |
| **Backend** | Java 21, Spring Boot 3.4.3, Spring Security 6, Spring Data JPA, Hibernate, Flyway |
| **Database** | PostgreSQL 14+ (Local, Neon, Supabase, Railway, Render) |
| **Documentation** | Swagger / OpenAPI 3.0 (`/swagger-ui.html`) |
| **Containerization**| Multi-stage Dockerfile (Eclipse Temurin 21 Alpine) |

---

## 🔐 Default Demo Accounts

All demo accounts are pre-configured with the default password: **`password123`**

| Role | Email | Permissions / View |
|---|---|---|
| **Manager** | `admin@meridian.com` | Full operational oversight, SLA audits, analytics dashboard, inventory management |
| **Dispatcher** | `dispatcher@meridian.com` | Create/assign work orders, dispatch technicians, manage customer sites |
| **Technician** | `tech1@meridian.com` | View assigned jobs, transition state, log labor hours, log consumed parts |
| **Customer** | `client@apexproperties.com` | Request maintenance, view status of facilities work orders |

*(Quick 1-click login buttons are also available directly on the login screen).*

---

## 🗄️ Database Setup & SQL Queries

The database schema and seed data are located in the `database/` directory:
- [`database/complete_database_setup.sql`](database/complete_database_setup.sql) — **Recommended**: Complete all-in-one script containing schema creation, indexes, and seed data.
- [`database/01_schema.sql`](database/01_schema.sql) — DDL table definitions and indexes.
- [`database/02_seed_data.sql`](database/02_seed_data.sql) — Initial customers, sites, users, parts, and work orders.

### 1. Using Cloud PostgreSQL (Neon / Supabase / Railway / Render)
1. Create a free PostgreSQL instance on [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app).
2. Open the **SQL Editor** or connect via `psql`.
3. Copy the contents of [`database/complete_database_setup.sql`](database/complete_database_setup.sql) and execute the query.

### 2. Using Local PostgreSQL
```bash
# Connect and create database
psql -U postgres
CREATE DATABASE keystone_db;
\q

# Execute database setup script
psql -U postgres -d keystone_db -f database/complete_database_setup.sql
```

*(Note: Spring Boot's built-in Flyway migration will also automatically run migrations on startup if connected to an empty database).*

---

## 🚀 Running Locally

### Prerequisites
- **Java 21 JDK** or newer
- **Node.js 18+** & **npm**
- **PostgreSQL 14+**

### Step 1: Start Backend
```bash
cd backend

# On Linux/macOS
./mvnw spring-boot:run

# On Windows
.\mvnw.cmd spring-boot:run
```
The backend will start at `http://localhost:8080`.
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:3000` with automated proxying to the backend.

---

## 🌐 Production Deployment

### 1. Deploy Frontend to Vercel
1. Push this repository to GitHub: `https://github.com/Yash-Marathe91/Field_Service_Management_Platform`.
2. Go to your [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository `Field_Service_Management_Platform`.
4. Configure Project Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Set Environment Variable:
   - `VITE_API_URL` = `https://your-deployed-backend-url/api` (e.g., your Render/Railway backend URL)
6. Click **Deploy**.
*(A `frontend/vercel.json` file is already included for SPA client-side routing).*

---

### 2. Deploy Backend to Render / Railway / Docker

#### Option A: Deploy to Render (Web Service)
1. Go to [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Set the following settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (uses the included `backend/Dockerfile`) or `Java`
   - **Build Command** (if Java): `./mvnw clean package -DskipTests`
   - **Start Command** (if Java): `java -jar target/keystone-1.0.0.jar`
4. Set Environment Variables:
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://<host>:<port>/<dbname>?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME` = `<db_username>`
   - `SPRING_DATASOURCE_PASSWORD` = `<db_password>`
   - `JWT_SECRET` = `<a-secure-random-64-char-string>`

#### Option B: Deploy with Docker
```bash
cd backend
docker build -t keystone-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/keystone_db \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  keystone-backend
```

---

## 📡 Core REST API Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & generate JWT token | Public |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Authenticated |
| `GET` | `/api/work-orders` | Filterable, paginated list of work orders | Role-scoped |
| `POST` | `/api/work-orders` | Raise a new work order with SLA calculation | Dispatcher, Manager, Customer |
| `GET` | `/api/work-orders/{id}` | Complete work order details & audit history | Role-scoped |
| `PUT` | `/api/work-orders/{id}` | Update work order details / assign tech | Dispatcher, Manager |
| `PATCH`| `/api/work-orders/{id}/status`| Transition state (`IN_PROGRESS`, `COMPLETED`)| Technician, Dispatcher |
| `POST` | `/api/work-orders/{id}/time-logs` | Record technician labor minutes | Technician, Manager |
| `POST` | `/api/work-orders/{id}/parts` | Log spare parts usage & deduct inventory | Technician, Manager |
| `GET` | `/api/parts` | Inventory catalog with stock levels | Authenticated |
| `POST` | `/api/parts` | Add spare part item to catalog | Manager, Dispatcher |
| `GET` | `/api/customers` | Customer directory & multi-site facilities | Manager, Dispatcher |
| `GET` | `/api/dashboard/metrics` | Executive operational KPIs & SLA metrics | Manager, Dispatcher |

---

## 📄 License
This project is licensed under the MIT License.
