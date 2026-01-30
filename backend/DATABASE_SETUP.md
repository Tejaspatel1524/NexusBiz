# Database Setup Guide

Complete guide for setting up the dual-database architecture for NexusBiz Backend.

---

## Prerequisites

- **PostgreSQL** 12+ installed and running
- **MongoDB** 4.4+ installed and running
- **Node.js** 18+ installed

---

## Step-by-Step Setup

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use chocolatey:
choco install postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nexusbiz;

# Create user (optional, for better security)
CREATE USER nexusbiz_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nexusbiz TO nexusbiz_user;

# Exit
\q
```

### 3. Install MongoDB

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use chocolatey:
choco install mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

### 4. Configure Environment Variables

Create `.env` file in the backend directory:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/nexusbiz?schema=public"
MONGODB_URI="mongodb://localhost:27017/nexusbiz"

# AI Configuration
ANTHROPIC_API_KEY=your_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Important**: Replace `password` with your actual PostgreSQL password!

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

This creates the TypeScript types and Prisma Client based on your schema.

### 6. Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
- Create all tables in PostgreSQL
- Apply indexes and constraints
- Prompt you to name the migration

Enter a name like: `init` or `initial_setup`

### 7. Seed the Database

```bash
npm run db:seed
```

This populates:
- 20 industries with metadata
- 6 business plan section templates

### 8. Verify Setup

```bash
# Open Prisma Studio to view data
npm run prisma:studio
```

This opens a GUI at `http://localhost:5555` where you can view/edit database records.

---

## Troubleshooting

### Error: "Can't reach database server"

**PostgreSQL:**
```bash
# Check if PostgreSQL is running
# Windows:
Get-Service postgresql*

# macOS/Linux:
ps aux | grep postgres

# Start if not running:
# Windows: Start PostgreSQL service in Services app
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

**MongoDB:**
```bash
# Check if MongoDB is running
# Windows:
Get-Service mongodb*

# macOS/Linux:
ps aux | grep mongod

# Start if not running:
# Windows: Start MongoDB service in Services app
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Error: "Authentication failed"

Check your DATABASE_URL credentials in `.env`:
- Username is correct
- Password is correct (no special characters unescaped)
- Database exists
- User has permissions

### Error: "Port already in use"

Another instance of PostgreSQL/MongoDB is running on the default port.

Change ports in `.env`:
```env
DATABASE_URL="postgresql://user:pass@localhost:5433/nexusbiz"  # Changed port
MONGODB_URI="mongodb://localhost:27018/nexusbiz"  # Changed port
```

### Migration Issues

Reset database (WARNING: Deletes all data):
```bash
npm run db:reset
```

---

## Database Management

### Viewing Data

**Prisma Studio (Recommended):**
```bash
npm run prisma:studio
```

**pgAdmin (PostgreSQL):**
- Download from https://www.pgadmin.org/
- Connect to localhost:5432

**MongoDB Compass:**
- Download from https://www.mongodb.com/products/compass
- Connect to localhost:27017

### Creating Migrations

After changing `prisma/schema.prisma`:

```bash
npm run prisma:migrate
```

Enter a descriptive migration name like:
- `add_user_avatar_field`
- `update_idea_indexes`
- `add_premium_tier`

### Resetting Database

```bash
# Nuclear option - deletes everything
npm run db:reset

# Then re-seed
npm run db:seed
```

---

## Production Setup

### Environment Variables

Set these environment variables in your hosting platform:

```env
NODE_ENV=production
DATABASE_URL=your_production_postgres_url
MONGODB_URI=your_production_mongodb_url
ANTHROPIC_API_KEY=your_api_key
JWT_SECRET=strong_random_secret
ALLOWED_ORIGINS=https://yourdomain.com
```

### Database Hosting Options

**PostgreSQL:**
- **Supabase** (Recommended, free tier): https://supabase.com
- **Railway**: https://railway.app
- **Heroku Postgres**: https://www.heroku.com/postgres
- **AWS RDS**: https://aws.amazon.com/rds/

**MongoDB:**
- **MongoDB Atlas** (Recommended, free tier): https://www.mongodb.com/atlas
- **Railway**: https://railway.app
- **DigitalOcean**: https://www.digitalocean.com/products/managed-databases

### Migrations in Production

```bash
# Deploy migrations (no seed)
npx prisma migrate deploy
```

---

## Backup & Recovery

### PostgreSQL Backup

```bash
# Backup
pg_dump -U postgres nexusbiz > backup.sql

# Restore
psql -U postgres nexusbiz < backup.sql
```

### MongoDB Backup

```bash
# Backup
mongodump --db nexusbiz --out ./backup

# Restore
mongorestore --db nexusbiz ./backup/nexusbiz
```

---

## Next Steps

After completing setup:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test API endpoints at `http://localhost:5000`

3. Check health endpoint: `http://localhost:5000/health`

4. View logs in `backend/logs/`

---

## Support

If you encounter issues:

1. Check `backend/logs/error.log`
2. Verify both PostgreSQL and MongoDB are running
3. Confirm `.env` has correct credentials
4. Try resetting: `npm run db:reset`
