# Template Usage Guide

This repository is a **template project** designed to be easily reusable for new projects.

## 🎯 Quick Setup for New Project

### Step 1: Clone and Search
1. Clone this repository
2. Open your IDE/editor
3. Press `Ctrl+F` (or `Cmd+F` on Mac)
4. Search for: **`example-project`**

### Step 2: Replace All Occurrences
Replace `example-project` with your project name in:

#### Files to Update:
- ✅ `package.json` - Project name
- ✅ `docker-compose.yml` - Container names, network, volumes
- ✅ `.env.example` - Environment variables
- ✅ `README.md` - Documentation
- ✅ `src/main.ts` - API title and description (or use `APP_NAME` env var)
- ✅ `src/app.module.ts` - Default database name

#### Naming Conventions:
- **Project name**: `example-project` → `your-project-name`
- **Database name**: `example_project_db` → `your_project_db` (snake_case)
- **Container name**: `example-project-db` → `your-project-db` (kebab-case)
- **Network name**: `example-project-network` → `your-project-network`
- **Volume name**: `example-project-postgres-data` → `your-project-postgres-data`

### Step 3: Environment Variables
1. Copy `.env.example` to `.env`
2. Update all `EXAMPLE_PROJECT_*` variables to match your project
3. Update database credentials
4. Set `APP_NAME` to your project name

### Step 4: Docker Configuration
Update `docker-compose.yml`:
- Service names
- Container names
- Network names
- Volume names

## 📋 Checklist

When adapting this template, make sure to update:

- [ ] `package.json` - name field
- [ ] `docker-compose.yml` - all service/container/network/volume names
- [ ] `.env.example` - all environment variables
- [ ] `README.md` - project name and descriptions
- [ ] `src/main.ts` - API title (or use `APP_NAME` env var)
- [ ] `src/app.module.ts` - default database name
- [ ] Any custom module names (currently `exemplo` module)

## 🔍 Finding All References

Use these search patterns to find everything:

1. **`example-project`** - Main project identifier (kebab-case)
2. **`example_project`** - Database names (snake_case)
3. **`exampleProject`** - JavaScript/TypeScript variables (camelCase)
4. **`ExampleProject`** - Class names (PascalCase)

## 💡 Tips

- The `APP_NAME` environment variable is used in `src/main.ts` for Swagger title
- Docker names use kebab-case (e.g., `example-project-db`)
- Database names use snake_case (e.g., `example_project_db`)
- All environment variables prefixed with `EXAMPLE_PROJECT_*` should be renamed

## 🚀 After Setup

Once you've replaced all occurrences:

1. Run `npm install`
2. Copy `.env.example` to `.env` and configure
3. Start database: `docker compose up -d example-project-db` (update name!)
4. Run migrations if needed
5. Start dev server: `npm run start:dev`

Your API will be available at `http://localhost:3000/api`

