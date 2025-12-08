# brainyprep.ai Assessment Backend

NestJS backend API for the brainyprep.ai Full-Stack Blockchain Developer assessment.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/brainyprep-assessment
```

4. Start the development server:
```bash
npm run start:dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

### Statistics
- `GET /api/stats` - Get transaction statistics
  - Returns: `{ success: true, data: { totalTransactions, totalVolume, averageAmount, successRate, pendingCount, confirmedCount, failedCount } }`

### Transactions
All transaction endpoints are public (no authentication required).

- `GET /api/transactions` - Get all transactions
  - Returns: `{ success: true, data: Transaction[] }`

- `GET /api/transactions/:id` - Get transaction by ID
  - Returns: `{ success: true, data: Transaction }`

- `POST /api/transactions` - Create a new transaction
  - Body: `{ toAddress: string, amount: string, gasLimit?: string, gasPrice?: string }`
  - Returns: `{ success: true, data: Transaction }`

## Transaction Response Format

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "hash": "0x1234...",
    "fromAddress": "0xabcd...",
    "toAddress": "0xefgh...",
    "amount": "1.5",
    "status": "pending|confirmed|failed",
    "gasLimit": "21000",
    "gasPrice": "0.00000002",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Database

The backend uses MongoDB with Mongoose. You need to have MongoDB running locally or use MongoDB Atlas.

### Local MongoDB Setup

1. Install MongoDB locally or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. Update `.env` with your connection string:
```env
MONGODB_URI=mongodb://localhost:27017/brainyprep-assessment
```

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brainyprep-assessment
```

The database and collections will be created automatically on first run.

## Notes

- **No authentication required** - all endpoints are public for simplicity
- Transactions are automatically assigned random hashes and from addresses
- Transaction status may change from "pending" to "confirmed" or "failed" after 2 seconds (simulated)
