# 🤖 Vanna AI Setup Guide

## ✅ What's Already Working

The chat endpoint (`/api/chat-with-data`) is **already functional** with real PostgreSQL data! It uses enhanced simulations that query the actual database.

**Test it now in your browser:**
1. Navigate to http://localhost:5173
2. Click "Chat with Data" in the sidebar
3. Try these queries:
   - "What is the total spend?"
   - "How many invoices are there?"
   - "Who is the top vendor?"
   - "Show me the average invoice value"

## 🚀 Optional: Enable Full Vanna AI (Natural Language SQL)

Want even more powerful AI-generated SQL queries? Follow these steps:

### Step 1: Get FREE Groq API Key

1. Visit **https://console.groq.com/keys**
2. Sign up (no credit card required)
3. Click "Create API Key"
4. Copy the key

### Step 2: Configure Vanna Service

```powershell
# Navigate to Vanna service
cd services\vanna

# Copy environment template
copy .env.example .env

# Edit .env and paste your Groq API key
notepad .env
```

**Update this line in `.env`:**
```env
GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 3: Install Python Dependencies

```powershell
# Install required packages
pip install -r requirements.txt
```

### Step 4: Start Vanna Service

```powershell
# Run the Vanna AI service
python app.py
```

**Expected output:**
```
✅ Connected to PostgreSQL database
✅ Vanna trained on database schema
🚀 Starting Vanna AI service on port 8000
INFO:     Application startup complete.
```

### Step 5: Test Vanna AI

```powershell
# Test the service
Invoke-RestMethod -Uri "http://localhost:8000/health"
```

### Step 6: Update API Environment

The API will automatically use Vanna when it's running on port 8000. No configuration needed!

## 📊 Current Status

| Component | Status | Data Source |
|-----------|--------|-------------|
| Dashboard | ✅ Working | PostgreSQL |
| API Endpoints | ✅ Working | PostgreSQL |
| Chat Interface | ✅ Working | PostgreSQL (Enhanced Simulations) |
| Vanna AI | ⚠️ Optional | Groq LLM + PostgreSQL |

## 🧪 Query Examples

### Already Working (No Vanna needed)
- ✅ "What is the total spend?" → €30,129.36
- ✅ "How many invoices?" → 50 invoices
- ✅ "Top vendor?" → CPB SOFTWARE (GERMANY) GMBH
- ✅ "Average invoice value?" → €614.88
- ✅ "Show categories" → Operations, Marketing
- ✅ "Monthly trends" → 10 months of data

### With Vanna AI (After Setup)
- 🤖 Complex queries like "Show me invoices from vendors in Germany"
- 🤖 Multi-table joins
- 🤖 Advanced aggregations
- 🤖 Date range filters
- 🤖 Natural language variations

## 🔧 Troubleshooting

### Chat shows "Failed to fetch"?
- Check if API server is running on port 3000
- Verify PostgreSQL Docker container is running

### Want to add more query patterns?
- Edit `apps/api/src/routes/chat.ts`
- Add new patterns in `simulateVannaResponse` function
- Restart API server

### Vanna service won't start?
- Check Python version: `python --version` (need 3.8+)
- Reinstall dependencies: `pip install -r requirements.txt`
- Verify `.env` has valid GROQ_API_KEY

## 🎯 Next Steps

1. ✅ **Test Chat Interface** - Try the queries above
2. 📦 **Optional: Setup Vanna** - Follow steps above for AI-powered SQL
3. 🚀 **Deploy to Cloud** - Deploy frontend + API to Vercel
4. 🐳 **Deploy Vanna** - Deploy Vanna service to Railway/Render

## 💡 Pro Tips

- **Development**: Current setup (enhanced simulations) is perfect for demo
- **Production**: Enable Vanna AI for unlimited query flexibility
- **Cost**: Groq free tier = 30 requests/minute (plenty for most use cases)
- **Performance**: Enhanced simulations are faster than full AI generation

## 📚 Documentation

- **Vanna Service**: See `services/vanna/README.md`
- **API Routes**: Check `apps/api/src/routes/chat.ts`
- **Database Schema**: View `apps/api/prisma/schema.prisma`
