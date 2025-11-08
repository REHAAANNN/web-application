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

- **Node.js** v18+ 
- **PostgreSQL** 16+ 
- **npm** v8+

### Step 1: Clone Repository

```bash
git clone https://github.com/REHAAANNN/web-application.git
cd web-application
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install API dependencies
cd apps/api
npm install

# Install Web dependencies
cd ../web
npm install
```

### Step 3: Setup PostgreSQL Database

**Using Docker (Recommended):**
```bash
docker run --name postgres-flowbit \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=flowbit_db \
  -p 5432:5432 \
  -d postgres:16
```

**Or install PostgreSQL locally and create database:**
```sql
CREATE DATABASE flowbit_db;
```

### Step 4: Configure Environment Variables

**Create `apps/api/.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowbit_db?schema=public"
PORT=3000
NODE_ENV=development
```

**Create `apps/web/.env`:**
```env
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

### Step 5: Database Migration & Seed Data

```bash
cd apps/api

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database with 50 sample invoices
npx tsx scripts/ingest-data.ts
```

**Expected Output:**
```
✅ Connected to database
✅ Created 50 invoices
✅ Database seeded successfully!
```

### Step 6: Start the Application

**Terminal 1 - Start API Server:**
```bash
cd apps/api
npm run dev
```
API runs on: **http://localhost:3000**

**Terminal 2 - Start Frontend:**
```bash
cd apps/web
npm run dev
```
Frontend runs on: **http://localhost:5173**

### Step 7: Verify Installation

```bash
# Test API
curl http://localhost:3000/api/stats

# Open browser
http://localhost:5173
```

---

## 🗄️ Database Schema & ER Diagram

### Database: `flowbit_db`

### Table: `Invoice`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String | PRIMARY KEY | Unique invoice identifier (UUID) |
| `invoiceNumber` | String | UNIQUE, NOT NULL | Human-readable invoice number (INV-XXXXX) |
| `vendorName` | String | NOT NULL | Name of the vendor/supplier |
| `amount` | Decimal | NOT NULL | Invoice amount in EUR |
| `currency` | String | DEFAULT 'EUR' | Currency code (EUR) |
| `invoiceDate` | DateTime | NOT NULL | Date when invoice was issued |
| `dueDate` | DateTime | NOT NULL | Payment due date |
| `status` | String | NOT NULL | Payment status (Pending, Processed, Overdue) |
| `category` | String | NOT NULL | Expense category (IT, Marketing, Operations, etc.) |
| `description` | String | NULLABLE | Invoice description/notes |
| `createdAt` | DateTime | DEFAULT NOW | Record creation timestamp |
| `updatedAt` | DateTime | AUTO-UPDATE | Last update timestamp |

### ER Diagram

**Entity: Invoice**

**Primary Key:** id (UUID)

**Unique Constraints:** invoiceNumber

**Status Values:** Pending, Processed, Overdue

**Category Values:** IT Services, Marketing, Operations, HR Services, Engineering, Finance

**Relationships:** Single table, no foreign key relationships

### Prisma Schema Definition

```prisma
model Invoice {
  id            String   @id @default(uuid())
  invoiceNumber String   @unique
  vendorName    String
  amount        Decimal  @db.Decimal(10, 2)
  currency      String   @default("EUR")
  invoiceDate   DateTime
  dueDate       DateTime
  status        String
  category      String
  description   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("invoices")
}
```

### Sample Data

The database is seeded with **50 invoices** from 5 vendors:
- **Acme Corp** (Engineering services)
- **TechSupply GmbH** (IT Services)
- **Marketing Solutions AG** (Marketing)
- **Phunk GmbH** (Operations)
- **Innovation Labs** (HR Services)

**Total Value:** €30,129.36  
**Date Range:** Last 6 months  
**Status Distribution:** 74% Processed, 20% Pending, 6% Overdue

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
No authentication required (development mode)

---

### 📊 **GET** `/api/stats`
Get overall invoice statistics.

**Response:**
```json
{
  "totalInvoices": 50,
  "totalValue": 30129.36,
  "avgInvoiceValue": 602.59,
  "activeVendors": 5,
  "processingRate": 74
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 📋 **GET** `/api/invoices`
Get all invoices with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string) - Search in vendor/invoice number
- `status` (string) - Filter by status
- `vendor` (string) - Filter by vendor name

**Example:**
```bash
GET /api/invoices?page=1&limit=10&status=Pending&search=Acme
```

**Response:**
```json
{
  "invoices": [
    {
      "id": "uuid-here",
      "invoiceNumber": "INV-00001",
      "vendorName": "Acme Corp",
      "amount": 599.99,
      "currency": "EUR",
      "invoiceDate": "2025-10-15T00:00:00Z",
      "dueDate": "2025-11-15T00:00:00Z",
      "status": "Pending",
      "category": "Engineering",
      "description": "Software development services",
      "createdAt": "2025-11-08T10:00:00Z",
      "updatedAt": "2025-11-08T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 📈 **GET** `/api/category-spend`
Get spending breakdown by category.

**Response:**
```json
[
  {
    "category": "Engineering",
    "total": 8500.50,
    "count": 15
  },
  {
    "category": "Marketing",
    "total": 7200.30,
    "count": 12
  }
]
```

---

### 💰 **GET** `/api/cashflow`
Get cash outflow forecast for next 6 months.

**Response:**
```json
[
  {
    "month": "2025-11",
    "amount": 5000.00,
    "count": 10
  },
  {
    "month": "2025-12",
    "amount": 4500.00,
    "count": 8
  }
]
```

---

### 🏢 **GET** `/api/vendors`
Get all unique vendors.

**Response:**
```json
[
  "Acme Corp",
  "TechSupply GmbH",
  "Marketing Solutions AG",
  "Phunk GmbH",
  "Innovation Labs"
]
```

---

### 📊 **GET** `/api/trends`
Get invoice trends over time.

**Query Parameters:**
- `months` (number, default: 6) - Number of months

**Response:**
```json
[
  {
    "month": "2025-11",
    "count": 12,
    "total": 7200.50,
    "average": 600.04
  },
  {
    "month": "2025-10",
    "count": 10,
    "total": 6500.00,
    "average": 650.00
  }
]
```

---

### 💬 **POST** `/api/chat-with-data`
Natural language query to SQL conversion and execution.

**Request Body:**
```json
{
  "query": "Show me total invoices by status"
}
```

**Response:**
```json
{
  "answer": "Here are the invoice counts by status",
  "sql": "SELECT status, COUNT(*) as count FROM invoices GROUP BY status",
  "results": [
    { "status": "Processed", "count": 37 },
    { "status": "Pending", "count": 10 },
    { "status": "Overdue", "count": 3 }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid query
- `500` - Server error

---

## 🤖 Chat with Data Workflow

### Complete Request-Response Flow

**Step 1: User Input**
- User types question in chat interface (React frontend)
- Example: "Show me pending invoices"

**Step 2: Frontend Sends Request**
- ChatInterface component sends HTTP POST request
- URL: http://localhost:3000/api/chat-with-data
- Request body: `{ "query": "Show me pending invoices" }`

**Step 3: API Receives Request**
- Express API server receives the query
- File: apps/api/src/routes/chat.ts
- Validates the input

**Step 4: Forward to Vanna AI**
- API forwards question to Vanna AI service
- URL: http://localhost:5000/generate-sql
- Request body: `{ "question": "Show me pending invoices" }`

**Step 5: Vanna Generates SQL**
- Vanna AI service (Python Flask) receives question
- AI model analyzes natural language
- Generates SQL query
- Returns: `{ "sql": "SELECT * FROM invoices WHERE status = 'Pending'" }`

**Step 6: API Executes SQL**
- API receives generated SQL from Vanna
- Validates SQL for safety
- Executes query on PostgreSQL using Prisma
- Query: `SELECT * FROM invoices WHERE status = 'Pending'`

**Step 7: Database Returns Results**
- PostgreSQL executes the SQL query
- Returns matching invoice records
- Data includes: invoiceNumber, amount, vendorName, etc.

**Step 8: API Formats Response**
- API formats database results
- Creates response object with answer, SQL, and results
- Response: `{ "answer": "Found 10 pending invoices", "sql": "...", "results": [...] }`

**Step 9: Frontend Displays Results**
- ChatInterface component receives response
- Displays SQL query in code block
- Shows results in formatted table
- Auto-generates chart if data is numeric
- Saves conversation to localStorage (chat history)

**Step 10: User Views Results**
- User sees SQL query that was generated
- User sees data in table format
- User sees visual chart (if applicable)
- Chat is saved for future reference

### Detailed Component Breakdown

#### 1️⃣ **Frontend (React)**
**File:** `apps/web/src/components/chat/ChatInterface.tsx`

**Responsibilities:**
- Capture user input from textarea
- Send POST request to API endpoint
- Display loading spinner during processing
- Render chat messages (user + assistant)
- Show SQL query in syntax-highlighted code block
- Display results in table format
- Auto-generate charts for numeric data

**Key Functions:**
```typescript
const handleSend = async () => {
  // 1. Create user message
  const userMessage = { role: 'user', content: input };
  
  // 2. Send to API
  const response = await fetch('http://localhost:3000/api/chat-with-data', {
    method: 'POST',
    body: JSON.stringify({ query: input })
  });
  
  // 3. Parse response
  const data = await response.json();
  
  // 4. Display assistant message with SQL + results
  const assistantMessage = {
    role: 'assistant',
    content: data.answer,
    sql: data.sql,
    results: data.results
  };
  
  // 5. Save to chat history
  saveChatMessage(input, data.answer);
};
```

#### 2️⃣ **API Server (Node.js + Express)**
**File:** `apps/api/src/routes/chat.ts`

**Responsibilities:**
- Receive natural language query
- Forward to Vanna AI service
- Execute generated SQL safely
- Return formatted results

**Route Handler:**
```typescript
router.post('/chat-with-data', async (req, res) => {
  const { query } = req.body;
  
  // Call Vanna AI to generate SQL
  const vannaResponse = await fetch('http://localhost:5000/generate-sql', {
    method: 'POST',
    body: JSON.stringify({ question: query })
  });
  
  const { sql } = await vannaResponse.json();
  
  // Execute SQL using Prisma
  const results = await prisma.$queryRawUnsafe(sql);
  
  // Return response
  res.json({
    answer: "Here are the results",
    sql: sql,
    results: results
  });
});
```

#### 3️⃣ **Vanna AI Service (Python)**
**File:** `services/vanna/app.py`

**Responsibilities:**
- Receive natural language question
- Use AI model to understand intent
- Generate syntactically correct SQL
- Return SQL query

**Flask Endpoint:**
```python
@app.route('/generate-sql', methods=['POST'])
def generate_sql():
    data = request.json
    question = data.get('question')
    
    # Use Vanna AI to generate SQL
    sql = vn.generate_sql(question)
    
    return jsonify({
        'sql': sql
    })
```

#### 4️⃣ **PostgreSQL Database**
**Location:** `localhost:5432/flowbit_db`

**Responsibilities:**
- Store invoice data
- Execute SQL queries
- Return query results
- Maintain data integrity

#### 5️⃣ **Chat History (localStorage)**
**File:** `apps/web/src/components/chat/ChatHistory.tsx`

**Responsibilities:**
- Save each Q&A pair to browser localStorage
- Display last 50 conversations
- Allow deletion of individual chats
- Persist across browser sessions

**Storage Format:**
```javascript
localStorage.setItem('chatHistory', JSON.stringify([
  {
    id: "uuid",
    question: "Show me pending invoices",
    answer: "Found 10 pending invoices",
    timestamp: "2025-11-08T10:30:00Z"
  }
]));
```

### Example Queries & Expected Flow

**Query 1:** "What's the total spend in the last 90 days?"

1. User types query in chat
2. Frontend sends to API
3. API forwards to Vanna AI
4. Vanna generates: `SELECT SUM(amount) FROM invoices WHERE invoiceDate >= NOW() - INTERVAL '90 days'`
5. API executes SQL on PostgreSQL
6. Database returns: `{ sum: 25000.00 }`
7. API sends formatted response to frontend
8. Frontend displays result with SQL query
9. Chat saved to history

**Query 2:** "List top 5 vendors by spend"

1. User types query
2. Vanna generates: `SELECT vendorName, SUM(amount) as total FROM invoices GROUP BY vendorName ORDER BY total DESC LIMIT 5`
3. Database returns top 5 vendors
4. Frontend displays results in table
5. Auto-generates bar chart visualization

### Error Handling

**Scenario 1: Vanna Service Down**
```json
{
  "error": "Failed to connect to Vanna AI service",
  "message": "Please ensure Vanna service is running on port 5000"
}
```

**Scenario 2: Invalid SQL Generated**
```json
{
  "error": "Invalid SQL query",
  "sql": "malformed query here",
  "message": "Please rephrase your question"
}
```

**Scenario 3: Database Connection Error**
```json
{
  "error": "Database connection failed",
  "message": "Please check PostgreSQL is running"
}
```

---

## ✨ Features Overview

### 1. Dashboard Analytics
- **Overview Cards:** Total invoices, value, avg invoice, active vendors
- **Interactive Charts:** Hover tooltips, responsive design
- **3 Main Charts:**
  - Category Spend (Pie chart)
  - Cash Outflow Forecast (Line chart)
  - Invoices by Vendor (Bar chart)
- **Additional Charts:**
  - Payment Status (Dual-axis bar)
  - Monthly Comparison (Multi-line trend)

### 2. Invoices Table
- **Search:** Filter by vendor name or invoice number
- **Filter:** By status, vendor, category
- **Sort:** Click column headers to sort
- **Pagination:** 10/25/50 items per page

### 3. Export Functionality
- **CSV Export:** Download invoices in CSV format
- **Excel Export:** Download as XLS file
- **Features:** Proper escaping, date formatting, currency formatting

### 4. Role-Based Views
- **Admin:** See all metrics (invoices, value, vendors)
- **Finance:** Focus on processing rates, payables
- **Operations:** Track active vendors, volume, processing time

### 5. Chat with Data (AI-Powered)
- **Natural Language Queries:** Ask questions in plain English
- **SQL Generation:** Automatic SQL query creation
- **Result Visualization:** Tables + auto-generated charts
- **Persistent History:** Last 50 chats saved in browser

### 6. Persistent Chat History
- **Storage:** Browser localStorage
- **Capacity:** Last 50 conversations
- **Features:** Delete individual, clear all, timestamps
- **Persistence:** Survives browser refresh

---

## 🛠️ Technology Stack

### Frontend
- **React** 19.1.1 - UI framework
- **TypeScript** 5.6.3 - Type safety
- **Vite** 7.1.14 - Build tool
- **Tailwind CSS** 3.4.1 - Styling
- **Recharts** 3.3.0 - Data visualization
- **Lucide React** 0.469.0 - Icons

### Backend
- **Node.js** v18+ - Runtime
- **Express** 4.21.1 - Web framework
- **TypeScript** 5.6.3 - Type safety
- **Prisma ORM** 6.19.0 - Database ORM
- **tsx** 4.19.2 - TypeScript execution

### Database
- **PostgreSQL** 16 - Relational database
- **Docker** - Database containerization

### AI/ML
- **Vanna AI** - Natural language to SQL
- **Python** 3.9+ - Vanna service runtime
- **Flask** - Python web framework

---

## 📦 Project Structure

**Root Directory: flowbit-assignment/**

**apps/api/** - Backend API Server
- prisma/ - Database schema and migrations
  - schema.prisma - Database schema definition
  - migrations/ - Database migration files
- scripts/ - Utility scripts
  - ingest-data.ts - Database seeding script
- src/ - Source code
  - index.ts - API server entry point
  - routes/ - API route handlers
  - services/ - Business logic services
- package.json - API dependencies

**apps/web/** - Frontend Application
- src/ - Source code
  - components/
    - chat/ - Chat interface components
    - dashboard/ - Dashboard components
  - services/ - API client services
  - types/ - TypeScript type definitions
  - App.tsx - Main application component
  - main.tsx - Application entry point
- package.json - Frontend dependencies

**services/vanna/** - Vanna AI Service
- app.py - Flask application
- requirements.txt - Python dependencies
- README.md - Vanna setup documentation

**Data/** - Sample Data
- Analytics_Test_Data.json - Test data for seeding

**Root Files**
- .gitignore - Git ignore rules
- package.json - Root workspace dependencies
- README.md - Project overview
- PROJECT_DOCUMENTATION.md - This file

---

## 🎯 Demo Checklist

**Before demonstrating, ensure:**

□ PostgreSQL database running

□ API server running on port 3000

□ Frontend running on port 5173

□ Database seeded with 50 invoices

□ Browser cache cleared

□ Prepare 3-4 sample chat queries

□ Test all features working


**Demo Flow:**

1. Show dashboard loading

2. Interact with charts (hover tooltips)

3. Switch role-based views

4. Filter/search invoices table

5. Export to CSV/Excel

6. Chat query → SQL → results → chart

7. Show persistent chat history

---

## 📞 Support

**GitHub:** https://github.com/REHAAANNN/web-application  
**Issues:** https://github.com/REHAAANNN/web-application/issues

---

**End of Documentation**
