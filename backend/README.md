# NexusBiz Backend API

Professional Node.js Express TypeScript backend for the Business Idea Generator application.

## Features

- 🤖 AI-powered business idea generation using Anthropic Claude
- 📊 Comprehensive business plan creation with parallel processing
- 🔒 Enterprise-grade security (Helmet, CORS, rate limiting)
- ✅ Input validation with Zod schemas
- 📝 Structured error handling and logging with Winston
- 🚀 Production-ready architecture

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **AI**: Anthropic Claude API
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
ANTHROPIC_API_KEY=your_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Ideas
- **POST** `/api/ideas/generate` - Generate business ideas
- **GET** `/api/ideas/:id` - Get idea by ID
- **GET** `/api/industries` - Get all industries

### Business Plans
- **POST** `/api/business-plan/generate` - Generate complete business plan
- **GET** `/api/business-plan/:id` - Get business plan by ID

## Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utilities
│   ├── config/           # Configuration
│   ├── types/            # TypeScript types
│   ├── app.ts            # Express app
│   └── server.ts         # Server entry point
├── logs/                 # Log files
├── package.json
└── tsconfig.json
```

## Rate Limits

- Idea Generation: 10 requests/minute
- Business Plan: 5 requests/minute
- Other endpoints: 100 requests/minute

## Error Handling

All errors return consistent JSON format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

## License

ISC
