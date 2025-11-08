# Vanna AI Service

Natural language to SQL generator service using Vanna AI and Groq LLM.

## 🚀 Quick Start

### 1. Install Python Dependencies
```powershell
cd services\vanna
pip install -r requirements.txt
```

### 2. Configure Environment
```powershell
# Copy example configuration
copy .env.example .env

# Edit .env and add your Groq API key
# Get FREE API key from: https://console.groq.com/keys
```

**Important:** Update the `.env` file with:
- `GROQ_API_KEY`: Your Groq API key (required)
- `DATABASE_URL`: Already configured for Docker PostgreSQL

### 3. Run the Service
```powershell
python app.py
```

Service will start on **http://localhost:8000**

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Generate SQL from Natural Language
```bash
POST /generate-sql
Content-Type: application/json

{
  "question": "What is the total spend across all invoices?"
}
```

**Response:**
```json
{
  "sql": "SELECT SUM(invoice_total) FROM summary",
  "results": [{"sum": 30129.36}],
  "answer": "The total spend across all invoices is €30,129.36"
}
```

### Legacy Endpoint (backward compatibility)
```bash
POST /api/v0/generate_sql
```

### Train Model on SQL Patterns
```bash
POST /train
Content-Type: application/json

{
  "sql": "SELECT v.name, SUM(s.invoice_total) FROM invoice i JOIN vendor v ON i.vendor_id = v.id JOIN summary s ON i.id = s.invoice_id GROUP BY v.name"
}
```

## 🔑 Getting Groq API Key (FREE)

1. Visit **https://console.groq.com/keys**
2. Sign up for a free account (no credit card required)
3. Click "Create API Key"
4. Copy the key and paste into `.env` file

**Free tier includes:**
- 30 requests per minute
- Perfect for development and testing

## 🗃️ Database Schema

The service connects to the same PostgreSQL database used by the main API:

```sql
-- Invoice table
CREATE TABLE invoice (
    id TEXT PRIMARY KEY,
    invoice_number TEXT,
    invoice_date TIMESTAMP,
    status TEXT,
    vendor_id TEXT,
    customer_id TEXT,
    created_at TIMESTAMP
);

-- Vendor table
CREATE TABLE vendor (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Summary table (invoice totals)
CREATE TABLE summary (
    id TEXT PRIMARY KEY,
    invoice_total DOUBLE PRECISION,
    invoice_id TEXT
);
```

## 🔗 Integration with Backend API

The Express backend (`apps/api`) integrates with this service:
- **Development**: Uses enhanced simulations with real database queries
- **Production**: Forwards to `http://localhost:8000/generate-sql` when configured

## 🧪 Test the Service

### Test with curl (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/generate-sql" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"question":"How many invoices are there?"}'
```

### Example Queries to Try
- "What is the total spend?"
- "Show me the top 5 vendors by spend"
- "How many invoices were processed this month?"
- "What is the average invoice value?"
- "Show me all pending invoices"

## 📊 How It Works

1. **Natural Language Input**: User asks a question in plain English
2. **Schema Context**: Vanna uses trained database schema knowledge
3. **SQL Generation**: Groq LLM generates appropriate SQL query
4. **Execution**: Query runs against PostgreSQL database
5. **Natural Language Response**: Results converted back to readable answer

## ⚙️ Configuration Options

Edit `.env` to customize:
- `GROQ_MODEL`: Change LLM model (default: llama3-groq-70b-8192-tool-use-preview)
- `PORT`: Change service port (default: 8000)
- `DATABASE_URL`: PostgreSQL connection string

## 🐛 Troubleshooting

**Service won't start?**
- Check Python version (3.8+ required)
- Verify all dependencies installed: `pip install -r requirements.txt`

**"Vanna AI service not initialized"?**
- Add your GROQ_API_KEY to `.env` file
- Restart the service

**Database connection errors?**
- Ensure PostgreSQL Docker container is running
- Verify DATABASE_URL in `.env` matches your setup

## 🚀 Deployment

For production deployment to cloud platforms (Railway, Render, Fly.io):
1. Add `Procfile`: `web: python app.py`
2. Set environment variables in platform dashboard
3. Ensure PostgreSQL database is accessible from deployment
