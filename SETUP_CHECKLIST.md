# Setup Checklist

Use this checklist to verify your setup is complete before starting the assessment.

## Prerequisites ✅

- [ ] Node.js v18 or higher installed
- [ ] MongoDB installed locally OR MongoDB Atlas account set up
- [ ] Git installed

## Backend Setup ✅

- [ ] Navigated to `backend/` directory
- [ ] Ran `npm install` (dependencies installed)
- [ ] Created `.env` file from `.env.example`
- [ ] Updated `.env` with MongoDB connection string:
  - Local: `MONGODB_URI=mongodb://localhost:27017/brainyprep-assessment`
- [ ] MongoDB is running (local or Atlas)
- [ ] Started backend with `npm run start:dev`
- [ ] Backend running on `http://localhost:3000`
- [ ] Health check works: `http://localhost:3000/api/health`

## Frontend Setup ✅

- [ ] Navigated to `frontend/` directory
- [ ] Ran `npm install` (dependencies installed)
- [ ] (Optional) Created `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3000/api`
- [ ] Started frontend with `npm run dev`
- [ ] Frontend running on `http://localhost:3001`
- [ ] Can see "Welcome to brainyprep.ai Assessment" in browser

## API Testing ✅

- [ ] Can register a new user via API
- [ ] Can login and receive JWT token
- [ ] Can access protected endpoints with token

## Documentation Review ✅

- [ ] Read `README.md` (main project overview)
- [ ] Read `ASSESSMENT.md` (enhanced task descriptions for senior developers)
- [ ] Read `backend/README.md` (API documentation)
- [ ] Read `frontend/README.md` (Next.js and shadcn/ui setup)
- [ ] Read `QUICK_START.md` (setup guide)
- [ ] Read `PROJECT_STRUCTURE.md` (project architecture)

## Ready to Start! 🚀

Once all items are checked, you're ready to begin implementing the assessment tasks!

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:3000/api/health

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login (use token from registration response)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint (replace TOKEN with actual token)
curl http://localhost:3000/api/transactions \
  -H "Authorization: Bearer TOKEN"
```

## Notes

- MongoDB must be running before starting the backend
- Frontend uses Next.js 14 with App Router
- shadcn/ui components can be added as needed: `npx shadcn-ui@latest add [component]`
- All tasks are designed for senior developers with advanced requirements
