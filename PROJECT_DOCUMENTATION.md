# Invoice Analytics Dashboard - Documentation

**GitHub:** https://github.com/REHAAANNN/web-application  
**Tech Stack:** React 19 + TypeScript + Node.js + PostgreSQL + Prisma ORM

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 16+
- npm v8+

### Quick Setup

**1. Clone & Install**
```bash
git clone https://github.com/REHAAANNN/web-application.git
cd web-application
npm install
cd apps/api && npm install
cd ../web && npm install
```

**2. Start PostgreSQL (Docker)**
```bash
docker run --name postgres-flowbit \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=flowbit_db \
  -p 5432:5432 -d postgres:16
```

**3. Configure Environment**

Create `apps/api/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowbit_db?schema=public"
PORT=3000
```

Create `apps/web/.env`:
```env
VITE_API_URL=http://localhost:3000
```

**4. Setup Database**
```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
npx tsx scripts/ingest-data.ts
```

**5. Start Servers**

Terminal 1 - API:
```bash
cd apps/api
npm run dev
```

Terminal 2 - Frontend:
```bash
cd apps/web
npm run dev
```

**Access:** http://localhost:5173

---

## �️ Database Schema

### Table: Invoice

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| invoiceNumber | String | Unique (INV-00001) |
| vendorName | String | Vendor name |
| amount | Decimal | Amount in EUR |
| currency | String | Default 'EUR' |
| invoiceDate | DateTime | Invoice date |
| dueDate | DateTime | Due date |
| status | String | Pending/Processed/Overdue |
| category | String | IT/Marketing/Operations/etc |
| description | String | Optional notes |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

**Sample Data:** 50 invoices, €30,129.36 total, 5 vendors

---

## 🔌 API Routes

**Base URL:** `http://localhost:3000/api`

### GET /api/stats
Overall statistics
```json
{
  "totalInvoices": 50,
  "totalValue": 30129.36,
  "avgInvoiceValue": 602.59,
  "activeVendors": 5,
  "processingRate": 74
}
```

### GET /api/invoices
List invoices with filters
- Query params: `page`, `limit`, `search`, `status`, `vendor`
- Returns: invoices array + pagination

### GET /api/category-spend
Spending by category
```json
[
  { "category": "Engineering", "total": 8500.50, "count": 15 }
]
```

### GET /api/cashflow
Cash outflow forecast (6 months)
```json
[
  { "month": "2025-11", "amount": 5000.00, "count": 10 }
]
```

### GET /api/vendors
List of all vendors
```json
["Acme Corp", "TechSupply GmbH", ...]
```

### GET /api/trends
Monthly invoice trends
```json
[
  { "month": "2025-11", "count": 12, "total": 7200.50, "average": 600.04 }
]
```

### POST /api/chat-with-data
Natural language to SQL
```json
// Request
{ "query": "Show me total invoices by status" }

// Response
{
  "answer": "Here are the invoice counts by status",
  "sql": "SELECT status, COUNT(*) FROM invoices GROUP BY status",
  "results": [
    { "status": "Processed", "count": 37 }
  ]
}
```

---

## 🤖 Chat with Data Workflow

**Complete Flow: Frontend → API → Vanna AI → SQL → Database → Results**

### Step-by-Step Process

**1. User Input**
- User types: "Show me pending invoices"
- ChatInterface component captures query

**2. Frontend → API**
- POST request to: `http://localhost:3000/api/chat-with-data`
- Body: `{ "query": "Show me pending invoices" }`

**3. API → Vanna AI**
- API forwards to Vanna service: `http://localhost:5000/generate-sql`
- Vanna AI analyzes natural language

**4. Vanna Generates SQL**
- AI returns SQL: `SELECT * FROM invoices WHERE status = 'Pending'`

**5. API → Database**
- API validates and executes SQL on PostgreSQL
- Uses Prisma: `prisma.$queryRawUnsafe(sql)`

**6. Database → API**
- PostgreSQL returns matching invoice records

**7. API → Frontend**
- API formats response with answer, SQL, and results

**8. Frontend Display**
- Shows SQL query in code block
- Displays results in table
- Auto-generates chart for numeric data
- Saves to localStorage (chat history)

### Components

**Frontend:** `apps/web/src/components/chat/ChatInterface.tsx`
- Captures user input
- Sends HTTP requests
- Displays results and SQL
- Saves chat history

**Backend:** `apps/api/src/routes/chat.ts`
- Receives queries
- Calls Vanna AI
- Executes SQL safely
- Returns formatted results

**AI Service:** `services/vanna/app.py` (Python Flask)
- Converts natural language to SQL
- Returns generated queries

**Database:** PostgreSQL on `localhost:5432`
- Stores invoice data
- Executes SQL queries

**Storage:** Browser localStorage
- Saves last 50 conversations
- Persists across sessions

### Example Queries

1. "What's the total spend in the last 90 days?"
   - SQL: `SELECT SUM(amount) FROM invoices WHERE invoiceDate >= NOW() - INTERVAL '90 days'`

2. "List top 5 vendors by spend"
   - SQL: `SELECT vendorName, SUM(amount) as total FROM invoices GROUP BY vendorName ORDER BY total DESC LIMIT 5`

3. "Show overdue invoices"
   - SQL: `SELECT * FROM invoices WHERE status = 'Overdue'`

---

## ✨ Key Features

1. **Dashboard Analytics**
   - Overview cards, interactive charts
   - 5 chart types (pie, line, bar, dual-axis, multi-line)

2. **Invoice Management**
   - Search, filter, sort, pagination
   - CSV/Excel export

3. **Role-Based Views**
   - Admin, Finance, Operations perspectives

4. **AI Chat Interface**
   - Natural language queries
   - SQL generation
   - Result visualization
   - Persistent history (50 chats)

---

## 🛠️ Technology Stack

**Frontend:** React 19.1.1, TypeScript 5.6.3, Vite 7.1.14, Tailwind CSS 3.4.1, Recharts 3.3.0

**Backend:** Node.js 18+, Express 4.21.1, TypeScript 5.6.3, Prisma ORM 6.19.0

**Database:** PostgreSQL 16

**AI:** Vanna AI, Python 3.9+, Flask

---

## 📦 Project Structure

```
flowbit-assignment/
├── apps/api/          - Backend (Express + Prisma)
├── apps/web/          - Frontend (React + Vite)
├── services/vanna/    - AI service (Python + Flask)
└── Data/              - Sample data
```

---

**End of Documentation**
