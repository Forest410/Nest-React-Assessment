# brainyprep.ai Assessment Frontend

Next.js frontend with shadcn/ui for the brainyprep.ai Full-Stack Blockchain Developer assessment.

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create a `.env.local` file if you need to change the API URL:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3001`

## Project Structure

```
app/
├── dashboard/       # Dashboard page with statistics (example implementation)
├── transactions/    # Transaction list page (to be implemented)
├── layout.tsx       # Root layout with navigation
├── page.tsx         # Home page (redirects to /dashboard)
└── globals.css      # Global styles

components/
├── Nav.tsx          # Navigation component
└── ui/              # shadcn/ui components (install as needed)

lib/
├── api.ts           # API service layer
└── utils.ts         # Utility functions
```

## Available Services

The `lib/api.ts` file provides pre-configured API functions:

### Transactions API
- `transactionsAPI.getAll()` - Get all transactions
- `transactionsAPI.getById(id)` - Get transaction by ID
- `transactionsAPI.create(data)` - Create new transaction

### Stats API
- `statsAPI.getStats()` - Get transaction statistics

## shadcn/ui Setup

This project is configured for shadcn/ui. To add components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
# etc.
```

## Tasks

See `../ASSESSMENT.md` for detailed task descriptions.

**Note**: No authentication is required! The backend is fully open - you can focus entirely on building the transaction management interface.
