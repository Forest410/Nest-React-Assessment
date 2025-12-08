# Quick Start Guide

This guide will help you get the assessment project up and running quickly.

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

## Step 1: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file from example
# On Windows (PowerShell):
Copy-Item .env.example .env
# On Mac/Linux:
cp .env.example .env

# Update .env with your MongoDB connection string
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/brainyprep-assessment
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brainyprep-assessment

# Ensure MongoDB is running (local or Atlas)

# Start the backend server
npm run start:dev
```

The backend should now be running on `http://localhost:3000`

## Step 2: Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# (Optional) Create .env.local from example
# On Windows (PowerShell):
# Copy-Item .env.local.example .env.local
# On Mac/Linux:
# cp .env.local.example .env.local

# Start the frontend development server
npm run dev
```

The frontend should now be running on `http://localhost:3001`

## Step 3: Verify Setup

1. Open your browser and go to `http://localhost:3001`
2. You should see the dashboard page
3. Check backend health: `http://localhost:3000/api/health`
4. Verify transactions exist: `http://localhost:3000/api/transactions`
5. Check stats: `http://localhost:3000/api/stats`

## Step 4: Start Building

1. Read `ASSESSMENT.md` for detailed task descriptions
2. Review `backend/README.md` for API documentation
3. Check `frontend/README.md` for frontend structure
4. Begin implementing the tasks!

## Troubleshooting

### Backend Issues

- **Port 3000 already in use**: Change `PORT` in `backend/.env`
- **MongoDB connection errors**: Ensure MongoDB is running and connection string is correct
- **Database errors**: Check MongoDB connection string in `.env`
- **Module not found**: Run `npm install` again in the backend directory

### Frontend Issues

- **Port 3001 already in use**: Change the port in `package.json` or use `-p` flag
- **API connection errors**: Ensure backend is running on port 3000
- **Module not found**: Run `npm install` again in the frontend directory
- **TypeScript errors**: Ensure all dependencies are installed correctly

### CORS Issues

If you encounter CORS errors, ensure:
- Backend CORS is configured (already done in `main.ts`)
- Frontend is running on `http://localhost:3001`
- Backend is running on `http://localhost:3000`

## Testing the API

You can test the backend API using curl or Postman:

```bash
# Health check
curl http://localhost:3000/api/health

# Get all transactions
curl http://localhost:3000/api/transactions

# Create a transaction
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"toAddress":"0x1234567890123456789012345678901234567890","amount":"1.5"}'
```

## Next Steps

1. ✅ Backend is running
2. ✅ Frontend is running
3. 📖 Read `ASSESSMENT.md`
4. 🚀 Start coding!

Good luck! 🎉
