# Assessment Tasks

Welcome! This assessment is designed to evaluate your skills as a senior full-stack developer, with a focus on Next.js, TypeScript, state management, and building production-ready features.

## ⚠️ Important Warning

**Don't use AI tools like ChatGPT, Cursor, etc. - it will fail.** This assessment must be completed using your own skills and knowledge.

## Overview

The backend is already implemented and provides a RESTful API. **No authentication is required** - you can focus entirely on building the transaction management interface.

The frontend has **2 pages**:
- `/dashboard` - Dashboard with statistics (already implemented as example)
- `/transactions` - Transaction list page (to be implemented)

Your task is to build the transaction management system with **2 focused tasks**.

## Setup

1. Start the backend: `cd backend && npm run start:dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:3001`
4. Begin implementing the tasks!

---

## Task 1: Transaction List with Filtering & Sorting

**Objective**: Build a transaction list page with data display, filtering, sorting, and pagination.

### Requirements:

1. **Transaction List Display** (`/transactions`)
   - Display transactions in a table or card layout (your choice)
   - Show: hash, from/to addresses, amount, status, timestamp
   - Format amounts with proper decimals (e.g., "1.5 ETH")
   - Format timestamps in readable format (e.g., "2 hours ago", "Jan 15, 2024")
   - Truncate long addresses (show first 6 and last 4 chars) with "copy to clipboard" button
   - Color-code transaction status:
     - Pending: yellow/orange
     - Confirmed: green
     - Failed: red
   - Responsive design (works on mobile and desktop)

2. **Filtering**
   - Filter by status (All, Pending, Confirmed, Failed)
   - Filter by date range (from/to dates using date pickers)
   - Filters should work together (combine multiple filters)
   - Clear filters button

3. **Search**
   - Search input that searches transaction hash and addresses
   - Debounced search (300ms delay)
   - Clear search button

4. **Sorting**
   - Sort by: Date (newest/oldest), Amount (high/low), Status
   - Visual indicator showing current sort (arrow up/down)
   - Click column header to sort

5. **Pagination**
   - Client-side pagination (10-20 items per page)
   - Show page numbers
   - Previous/Next buttons
   - Display "Showing X-Y of Z transactions"

### Technical Requirements:
- Use TypeScript with proper types
- Implement proper loading states (skeletons)
- Handle empty states (no transactions, no results)
- Handle error states with retry button
- Use shadcn/ui components

### API Endpoint:
- `GET /api/transactions` - Returns array of transactions

---

## Task 2: Transaction Details & Creation Form

**Objective**: Build transaction details view and a form to create new transactions.

### Requirements:

1. **Transaction Details**
   - Click on a transaction to view details in a modal or drawer
   - Display all transaction information:
     - Transaction hash (with copy button)
     - From/To addresses (with copy buttons)
     - Amount with currency
     - Status with visual indicator
     - Gas limit and gas price
     - Timestamp (formatted)
     - Transaction fee (calculated: gas limit × gas price)
   - "View on Explorer" button (mock link, e.g., `https://etherscan.io/tx/{hash}`)
   - Close button to dismiss modal/drawer

2. **Create Transaction Form**
   - Form fields:
     - To address (required, Ethereum address validation)
     - Amount (required, must be positive number)
     - Gas limit (optional, default: 21000)
     - Gas price (optional, default: 0.00000002)
   - Real-time validation:
     - Address format validation (0x followed by 40 hex characters)
     - Show validation errors immediately
     - Amount must be positive number
   - Transaction fee preview (calculated in real-time: gas limit × gas price)
   - Submit button that calls API
   - Success toast notification with transaction hash
   - Auto-refresh transaction list after successful creation
   - Form state persistence (save draft in localStorage, restore on page reload)

### Technical Requirements:
- Use `react-hook-form` with `zod` for validation
- Proper error handling and user feedback
- Loading states during submission
- Use shadcn/ui components (Dialog, Drawer, or Modal)

### API Endpoints:
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions` - Create transaction
  - Body: `{ toAddress: string, amount: string, gasLimit?: string, gasPrice?: string }`

---

## Evaluation Criteria

We'll be evaluating:

### Code Quality (30%)
- Clean, maintainable, and well-organized code
- Proper TypeScript usage with strict types
- Component structure and reusability
- Consistent code style and formatting

### Functionality (30%)
- All requirements are met
- Proper error handling and edge cases
- Form validation and user input handling

### UI/UX (25%)
- Modern, polished interface using shadcn/ui
- Responsive design (mobile and desktop)
- Loading and error states
- User feedback (toasts, notifications)
- Accessibility considerations

### Performance & Best Practices (15%)
- Efficient rendering (memoization where appropriate)
- Proper state management
- Next.js App Router best practices
- Security considerations (input validation)

## Time Estimate

We expect this to take **3-4 hours** for a senior developer. Focus on quality and proper implementation.

## Getting Started

1. Review the backend API documentation in `backend/README.md`
2. Start the backend server: `cd backend && npm run start:dev`
3. Start the frontend: `cd frontend && npm run dev`
4. Visit `http://localhost:3001`
5. Install shadcn/ui components as needed: `npx shadcn-ui@latest add [component]`
6. Begin with Task 1, then Task 2

## Notes

- **No authentication required** - all endpoints are public
- The frontend has minimal scaffolding - you'll build most of it
- Feel free to use any additional libraries you're comfortable with
- The backend is already set up - focus on the frontend
- If you encounter any issues, document them in your submission

## Bonus Points (Optional)

- Add real-time polling to update transaction status automatically
- Implement dark mode theme switching
- Add export to CSV functionality
- Add unit tests for utility functions
- Implement optimistic updates for new transactions

Good luck! 🚀
