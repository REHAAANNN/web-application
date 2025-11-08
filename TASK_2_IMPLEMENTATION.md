# Task 2 Implementation - Chat with Data Interface

## ✅ What's Been Completed

### Frontend (React + TypeScript)

1. **New UI Components Created:**
   - `ChatInterface.tsx` - Main chat UI with message history
   - `ChatMessage.tsx` - Individual message bubbles with SQL/results display
   - `ResultsDisplay.tsx` - Table view for query results
   
2. **App Structure Updated:**
   - Added sidebar navigation with tabs:
     - Dashboard (existing)
     - Chat with Data (new)
   - Responsive layout with proper routing

3. **Features Implemented:**
   - Natural language query input
   - Streaming-style message display
   - SQL code highlighting
   - Results table with auto-formatting
   - Example query suggestions
   - Loading states

### Backend API (Express + TypeScript)

1. **Server Setup:**
   - `/apps/api/` folder structure created
   - `package.json` configured with all dependencies
   - TypeScript configuration
   - Environment variables template

2. **Dependencies Installed:**
   - express, cors, dotenv, pg
   - TypeScript types
   - tsx for development

## 🚧 What Needs to Be Done

### 1. Create API Route Files

Create these files in `apps/api/src/routes/`:

**`stats.ts`** - GET /api/stats
```typescript
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  // Return dashboard stats: totalSpend, invoicesProcessed, etc.
  res.json({ totalSpend: 12679.25, invoicesProcessed: 64, ... });
});

export default router;
```

**`invoices.ts`** - GET /api/invoices?search=&sort=
```typescript
// Return paginated invoice list with search/filter
```

**`vendors.ts`** - GET /api/vendors/top10
```typescript
// Return top 10 vendors by spend
```

**`trends.ts`** - GET /api/invoice-trends
```typescript
// Return monthly invoice count and spend
```

**`category.ts`** - GET /api/category-spend
```typescript
// Return spend grouped by category
```

**`cashflow.ts`** - GET /api/cash-outflow
```typescript
// Return expected cash outflow by date range
```

**`chat.ts`** - POST /api/chat-with-data
```typescript
import { Router } from 'express';
import axios from 'axios';
const router = Router();

router.post('/', async (req, res) => {
  const { query } = req.body;
  
  try {
    // Forward to Vanna AI service
    const vannaResponse = await axios.post(
      `${process.env.VANNA_API_BASE_URL}/api/v0/generate_sql`,
      { question: query }
    );
    
    // Execute SQL and return results
    res.json({
      answer: 'Here are the results:',
      sql: vannaResponse.data.sql,
      results: vannaResponse.data.results
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process query' });
  }
});

export default router;
```

### 2. Setup Vanna AI Service

Create `services/vanna/` directory with:

**`requirements.txt`**
```
vanna
groq
psycopg2-binary
fastapi
uvicorn
python-dotenv
```

**`app.py`**
```python
from vanna.groq import Groq_Chat
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

app = FastAPI()

# Initialize Vanna with Groq
vn = Groq_Chat(
    model="llama3-groq-70b-8192-tool-use-preview",
    api_key=os.getenv("GROQ_API_KEY")
)

# Connect to PostgreSQL
vn.connect_to_postgres(
    host=os.getenv("DB_HOST"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=int(os.getenv("DB_PORT", 5432))
)

class Question(BaseModel):
    question: str

@app.post("/api/v0/generate_sql")
async def generate_sql(q: Question):
    try:
        sql = vn.generate_sql(q.question)
        results = vn.run_sql(sql)
        return {
            "sql": sql,
            "results": results.to_dict('records')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Run with:**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

### 3. Database Setup

Create PostgreSQL database with invoice schema:

```sql
CREATE TABLE invoices (
    id VARCHAR PRIMARY KEY,
    vendor_name VARCHAR,
    invoice_number VARCHAR,
    invoice_date DATE,
    amount DECIMAL(10,2),
    status VARCHAR,
    category VARCHAR,
    due_date DATE,
    created_at TIMESTAMP
);
```

### 4. Environment Variables

**Frontend** (`apps/web/.env`):
```
VITE_API_BASE_URL=http://localhost:3000
```

**Backend** (`apps/api/.env`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/flowbit_db
VANNA_API_BASE_URL=http://localhost:8000
PORT=3000
```

**Vanna** (`services/vanna/.env`):
```
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/flowbit_db
GROQ_API_KEY=your_groq_api_key
PORT=8000
```

### 5. Running the Full Stack

Terminal 1 - Frontend:
```bash
cd apps/web
npm run dev
```

Terminal 2 - Backend API:
```bash
cd apps/api
npm run dev
```

Terminal 3 - Vanna AI:
```bash
cd services/vanna
python app.py
```

## 📸 What You'll See

1. **Dashboard Tab**: Existing analytics dashboard
2. **Chat with Data Tab**: 
   - Chat interface with example queries
   - Type natural language questions
   - See generated SQL
   - View results in formatted tables

## 🔗 Integration Points

- Frontend calls `/api/chat-with-data` (Express API)
- Express API forwards to Vanna AI service (port 8000)
- Vanna uses Groq to generate SQL
- Vanna executes SQL on PostgreSQL
- Results flow back through the chain

## 🎯 Next Steps

1. Complete the 6 route files in `apps/api/src/routes/`
2. Set up PostgreSQL database
3. Create Vanna AI service in `services/vanna/`
4. Configure all environment variables
5. Test end-to-end flow

## 📝 Notes

- All frontend code is complete and functional
- Backend structure is ready, just needs route implementations
- Mock data can be used until real database is connected
- Chat interface gracefully handles API errors
