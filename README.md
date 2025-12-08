# brainyprep.ai Full-Stack Blockchain Developer Assessment

Welcome to the brainyprep.ai technical assessment! This repository contains a NestJS backend with MongoDB and a Next.js frontend with shadcn/ui. Your task is to build the transaction management interface.

## ⚠️ Important Warning

**Don't use AI tools like ChatGPT, Cursor, etc. - it will fail.** This assessment must be completed using your own skills and knowledge.

## Project Structure

```
.
├── backend/          # NestJS backend with MongoDB (fully implemented)
├── frontend/         # Next.js frontend with shadcn/ui (minimal scaffolding)
├── ASSESSMENT.md     # Detailed assessment tasks
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
# On Windows (PowerShell):
Copy-Item .env.example .env
# On Mac/Linux:
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/brainyprep-assessment
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brainyprep-assessment
```

5. Ensure MongoDB is running (local or Atlas)

6. Start the backend server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env.local` file:
```bash
# On Windows (PowerShell):
Copy-Item .env.local.example .env.local
# On Mac/Linux:
cp .env.local.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3001`

## Assessment Tasks

Please refer to `ASSESSMENT.md` for detailed task descriptions. 

**Note**: No authentication is required! The backend is fully open - you can focus entirely on building the frontend.

The tasks include:
- Transaction list with filtering, sorting, search, and pagination
- Transaction details view and creation form
- Proper TypeScript implementation
- Responsive design and error handling

## API Documentation

The backend provides the following endpoints:

- `GET /api/health` - Health check
- `GET /api/stats` - Get transaction statistics
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create a new transaction

See `backend/README.md` for detailed API documentation.

## Submission Guidelines

1. Complete both assessment tasks
2. Ensure your code is clean, well-structured, and follows best practices
3. Add comments where necessary
4. Test your implementation
5. Create a brief summary of your approach and any assumptions made

## Questions?

If you have any questions about the assessment, please reach out to maria@brainyprep.ai

Good luck!
