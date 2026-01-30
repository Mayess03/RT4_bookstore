# RT4 Bookstore 📚

A full-stack online bookstore application built with NestJS, TypeORM/PostgreSQL, and Angular 21, featuring JWT-based authentication, role-based access control, and admin dashboards.

---

## Project Overview ✨

RT4 Bookstore is a full-stack bookstore application:

- **Backend**: NestJS API with PostgreSQL, authentication (JWT), role-based access (Admin/User), real-time notifications via Socket.IO, and seed/test tooling.
- **Frontend**: Angular SPA with Tailwind CSS & Angular Material, consuming backend APIs.
- **Fully functional admin dashboard** with real-time order notifications.

---

## Features 🔧

- ✅ **User Authentication**: Login/Register with JWT, token refresh.
- ✅ **Role-based access**: Admin vs User.
- ✅ **Book management**: List, detail, search.
- ✅ **Categories management**.
- ✅ **Cart & wishlist management**.
- ✅ **Order processing & checkout**.
- ✅ **Reviews management**.
- ✅ **Real-time order notifications** (Socket.IO).
- ✅ **Admin dashboard** with user/book/order management.

---

## Tech Stack 🏗️

- **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend**: Angular 21, Tailwind CSS, Angular Material
- **Real-time**: Socket.IO
- **Dev tools**: Docker, Docker Compose, Swagger

---

## Quickstart — Run Locally ✅

### Prerequisites

- Node.js (LTS, 18+)
- npm
- PostgreSQL (or Docker Compose included)
- Optional: Docker & Docker Compose (to start DB + pgAdmin)

### Backend (server)

1. **Install dependencies**:

```bash
cd backend
npm install
```

2. **Start database**:

   - **Docker**:

     ```bash
     docker-compose up -d
     ```

   - **Local Postgres**: Ensure `.env` DB settings match your local DB.

3. **Configure `.env` file** (see [Environment Variables](#environment-variables-⚙️)).

4. **Run server**:

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build && npm run start:prod
   ```

- **Swagger API docs**: http://localhost:3000/api/docs
- **API prefix**: `/api`

### Frontend (client)

1. **Install dependencies**:

   ```bash
   cd client
   npm install
   ```

2. **Start dev server**:

   ```bash
   ng serve
   ```

3. **Open**: http://localhost:4200

---

## Environment Variables (.env) ⚙️

Located at `.env` in the backend root. Key variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=rt4_bookstore

# JWT
JWT_SECRET=your_jwt_secret
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=3600s

# App
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4200
```

---

## Scripts 📋

### Backend

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run start`   | Start server                           |
| `npm run start:dev` | Start in watch mode (dev)              |
| `npm run build`   | Build project                          |
| `npm run seed`    | Populate database with sample data     |
| `npm run lint`    | ESLint checks + fixes                  |
| `npm run format`  | Prettier formatting                    |
| `npm run test`    | Run unit tests                         |
| `npm run test:e2e`| Run end-to-end tests                   |

### Frontend

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run start` | Angular dev server           |
| `npm run build` | Build web app                |
| `npm run test`  | Run frontend tests           |

---

## Docker Compose

Sets up Postgres + pgAdmin for easy DB management.

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: rt4_bookstore
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@rt4.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - '5050:80'
    depends_on:
      - postgres

volumes:
  postgres_data:
```
