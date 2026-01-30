# NexusBiz Database Architecture

Dual-database architecture combining PostgreSQL (Prisma) for structured data and MongoDB (Mongoose) for unstructured AI-generated content.

---

## Database Overview

### PostgreSQL (Prisma ORM)
**Purpose**: Structured relational data
- Users & authentication
- Business ideas metadata
- Business plan records
- Analytics & tracking
- Industry reference data
- Templates

### MongoDB (Mongoose ODM)
**Purpose**: Unstructured document storage
- Complete business plan content
- AI-generated sections (market analysis, financial projections, etc.)
- Nested complex objects
- Flexible schema for evolving AI outputs

---

## Schema Overview

### PostgreSQL Models

**8 Core Models:**
1. `User` - User accounts and subscription data
2. `Idea` - Business idea metadata and scores
3. `BusinessPlan` - Business plan records (links to MongoDB)
4. `UserInput` - Questionnaire responses
5. `IdeaComparison` - Comparison data for multiple ideas
6. `Analytics` - Event tracking and metrics
7. `Industry` - Industry reference data
8. `Template` - Business plan section templates

---

## Key Features

### Relationships
- User → Ideas (one-to-many)
- User → BusinessPlans (one-to-many)
- Idea → BusinessPlan (one-to-one)
- BusinessPlan → MongoDB Content (via `mongodbContentId`)

### Indexes
- Email index for fast user lookup
- Composite index on `(userId, createdAt)` for user timelines
- Industry index for filtering
- Event type index for analytics queries
- Slug index for industry lookup

### Enums
- `SubscriptionTier`: free, pro, enterprise
- `IdeaStatus`: draft, generated, viewed, favorite, archived
- `GenerationStatus`: pending, processing, completed, failed
- `EventType`: idea_generated, plan_generated, pdf_exported, etc.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nexusbiz"
MONGODB_URI="mongodb://localhost:27017/nexusbiz"
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Run Migrations
```bash
npm run prisma:migrate
```

### 5. Seed Database
```bash
npm run db:seed
```

---

## Repository Layer

All database operations are abstracted through repository classes:

- `IdeaRepository` - CRUD for business ideas
- `BusinessPlanRepository` - PostgreSQL + MongoDB integration
- `UserRepository` - User management
- `AnalyticsRepository` - Event logging and statistics
- `IndustryRepository` - Industry reference data

---

## Data Flow

### Idea Generation
1. User submits questionnaire → `UserInput` saved
2. AI generates ideas → `Idea` records created
3. User views idea → Analytics event logged
4. User favorites → `Idea.status` updated

### Business Plan Creation
1. User selects idea → `BusinessPlan` record created (pending)
2. AI generates sections in parallel → Saved to MongoDB
3. PostgreSQL updated with `mongodbContentId` reference
4. Status updated to `completed`
5. Sections tracked in `sectionsCompleted` JSONB field

---

## Scripts

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio (GUI)
npm run prisma:studio

# Seed database
npm run db:seed

# Reset database (WARNING: deletes all data)
npm run db:reset
```

---

## Best Practices

1. **Always use repositories** - Never query Prisma/Mongoose directly
2. **Handle errors** - All repository methods include error logging
3. **Use transactions** - For operations affecting multiple tables
4. **Index properly** - Add indexes for frequently queried fields
5. **Validate input** - Use Zod schemas before database insertion
6. **Log analytics** - Track all important user actions

---

## Data Retention

- Analytics: 90 days (configurable)
- Soft deletes for Ideas (status: archived)
- Hard deletes only for GDPR compliance

---

## Performance Optimization

- Connection pooling enabled (20 connections for PostgreSQL)
- MongoDB indexes on businessPlanId, ideaId, createdAt
- Query result caching (future: Redis)
- Pagination for large result sets
