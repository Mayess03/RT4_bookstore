```markdown
# RT4 Bookstore 📚

A full-stack online bookstore application built with NestJS, TypeORM/Postgres, and Angular 21, featuring JWT-based authentication, role-based access control, real-time stats, and admin dashboards.

## Project Overview ✨

RT4 Bookstore is a full-stack bookstore application:

- **Backend**: NestJS API with PostgreSQL, authentication (JWT), role-based access (Admin/User), real-time notifications via Socket.IO, and seed/test tooling.
- **Frontend**: Angular SPA with Tailwind CSS & Angular Material, consuming backend APIs and real-time events.
- Fully functional admin dashboard with real-time order notifications.

## Features 🔧

- **User Authentication**: Login/Register with JWT, token refresh.
- **Role-based access**: Admin vs User.
- **Book management**: List, detail, search.
- **Categories management**.
- **Cart & wishlist management**.
- **Order processing & checkout**.
- **Reviews management**.
- **Real-time stats & order notifications (Socket.IO)**.
- **Admin dashboard** with user/book/order management.

## Tech Stack 🏗️

### Backend
- **Framework**: NestJS, TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport.js
- **Real-time**: Socket.IO
- **Documentation**: Swagger

### Frontend
- **Framework**: Angular 21
- **Styling**: Tailwind CSS, Angular Material
- **State Management**: RxJS, Services
- **Testing**: Angular Testing Library

### DevOps & Tools
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier

## Quickstart — Run Locally

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

6. **Swagger API docs**: http://localhost:3000/api/docs
   - API prefix: `/api`

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

## Environment Variables (.env) ⚙️

Located at `.env` in the backend root. Key variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=rt4_bookstore

# JWT Authentication
JWT_SECRET=your_jwt_secret
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=3600s

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4200
```

## Scripts 📋

### Backend

| Command | Description |
|---------|-------------|
| `npm run start` | Start server |
| `npm run start:dev` | Start in watch mode (dev) |
| `npm run build` | Build project |
| `npm run seed` | Populate database with sample data |
| `npm run lint` | ESLint checks + fixes |
| `npm run format` | Prettier formatting |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run start` | Angular dev server |
| `npm run build` | Build web app |
| `npm run test` | Run frontend tests |

## Docker Deployment 🐳

Docker Compose sets up Postgres + pgAdmin for easy DB management.

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## API Reference 📡

High-level endpoints (all prefixed with `/api`):

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **auth** | `/login`, `/register`, `/refresh`, `/logout` | JWT authentication |
| **users** | `/profile`, `/admin` | User profile & admin user management |
| **books** | `/`, `/:id`, `/search` | List, details, search books |
| **category** | `/`, `/create`, `/update/:id` | Manage categories |
| **cart** | `/`, `/add`, `/remove` | Cart operations |
| **orders** | `/`, `/create`, `/update/:id` | Orders & checkout |
| **reviews** | `/`, `/create`, `/update/:id` | Reviews CRUD |
| **wishlist** | `/`, `/add`, `/remove` | Wishlist management |
| **admin** | `/dashboard`, `/users`, `/books` | Admin-only endpoints |
| **stats** | `/realtime` | Real-time stats (Socket.IO) |

Full Swagger docs available at `/api/docs`.

## Frontend Features 🎨

- Responsive design with Tailwind + Angular Material.
- Admin vs User views.
- Auth-aware navigation and route guards.
- Real-time order notifications.
- Interactive cart and wishlist.

## Project Structure 📁

```
rt4-bookstore/
├── backend/
│   ├── src/
│   │   ├── modules/       # Feature modules (auth, books, orders, etc.)
│   │   ├── entities/      # TypeORM entities
│   │   ├── middleware/    # Custom middleware
│   │   ├── guards/        # Auth guards
│   │   ├── interceptors/  # Response interceptors
│   │   ├── pipes/         # Validation pipes
│   │   ├── decorators/    # Custom decorators
│   │   └── shared/        # Shared utilities
│   ├── test/
│   ├── .env
│   ├── docker-compose.yml
│   └── package.json
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Reusable components
│   │   │   ├── pages/       # Page components
│   │   │   ├── services/    # API services
│   │   │   ├── guards/      # Route guards
│   │   │   ├── interceptors/# HTTP interceptors
│   │   │   └── models/      # TypeScript interfaces
│   │   ├── assets/
│   │   └── environments/    # Environment configs
│   └── package.json
└── README.md
```
