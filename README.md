# example-project

Backend API template built with NestJS, TypeORM, PostgreSQL, and Docker.

## 📋 Template Instructions

**This repository is a template project.** To use it for a new project:

1. Clone this repository
2. Search for `example-project` (Ctrl+F / Cmd+F) across all files
3. Replace all occurrences with your project name
4. Update environment variables in `.env` file
5. Update Docker container names and network names if needed

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Running with Docker

```bash
# Start database
docker compose up -d example-project-db

# Run migrations (if needed)
npm run migration:run

# Start development server
npm run start:dev
```

### Running without Docker

Make sure PostgreSQL is running locally and update `.env` accordingly.

```bash
npm run start:dev
```

## 📚 API Documentation

Once the server is running:

- **Swagger UI**: http://localhost:3000/api
- **Scalar API Reference** (if enabled): http://localhost:3000/reference

To enable Scalar in local development, set `ENABLE_SCALAR=true` in your `.env` file.

## 🏗️ Project Structure

```
src/
├── common/           # Shared utilities, DTOs, entities
│   ├── base.entity.ts
│   ├── base-query.dto.ts
│   ├── enum/
│   └── query/
├── modules/          # Feature modules
│   └── exemplo/      # Example module (replace with your modules)
└── main.ts          # Application entry point
```

## 🔧 Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Lint code

## 🌐 Environment Variables

See `.env.example` for all available environment variables. Key variables:

- `APP_NAME` - Application name (default: example-project)
- `SERVER_PORT` - API server port (default: 3000)
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` - Database configuration
- `ENABLE_SCALAR` - Enable Scalar API Reference (default: false)

## 🐳 Docker

The project includes Docker Compose configuration for local development:

- **Database**: PostgreSQL 15 Alpine
- **Container name**: `example-project-db`
- **Network**: `example-project-network`
- **Volume**: `example-project-postgres-data`

## 📝 Features

- ✅ RESTful API with NestJS
- ✅ TypeORM with PostgreSQL
- ✅ Swagger/OpenAPI documentation
- ✅ Scalar API Reference (optional)
- ✅ Global validation pipes
- ✅ Generic query filtering and pagination
- ✅ Docker Compose setup
- ✅ Environment-based configuration

## 🔍 Finding Project-Specific Names

To customize this template for a new project, search for:

- `example-project` - Main project identifier
- `example_project_db` - Database name
- `example-project-db` - Docker container name
- `example-project-network` - Docker network name
- `example-project-postgres-data` - Docker volume name

## 📦 Deployment

### AWS EC2 + PM2

1. Set up EC2 instance
2. Install Node.js and PM2
3. Clone repository
4. Configure `.env` file
5. Build and start with PM2:

```bash
npm run build
pm2 start dist/main.js --name example-project-api
pm2 save
pm2 startup
```

### Docker Production

```bash
docker build -t example-project-backend .
docker run -d --name example-project-app -p 3000:3000 --env-file .env example-project-backend
```

## 📄 License

This project is licensed under the MIT License.
