# Flowbit Assignment - Full Stack Analytics Dashboard

## 🎯 Features

### ✅ Task 1: Analytics Dashboard
- **Overview Cards**: Total Spend, Invoices Processed, Documents Uploaded, Average Invoice Value
- **Charts**:
  - Invoice Volume & Value Trend (dual-axis line chart)
  - Top 10 Vendors by Spend (horizontal bar chart)
  - Spend by Category (pie chart)
  - Cash Outflow Forecast (bar chart)
- **Invoice Table**: Searchable, sortable, scrollable with status badges

### ✅ Task 2: Chat with Data Interface
- Natural language query interface
- AI-powered SQL generation (simulated responses included)
- Results display with formatted tables
- Example queries provided

## 🚀 Quick Start

### Option 1: Using Start Script (Windows)
```bash
start.bat
```

### Option 2: Manual Setup

**Terminal 1 - Backend API:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

**Terminal 3 - Vanna AI (Optional):**
```bash
cd services/vanna
pip install -r requirements.txt
python app.py
```

## 📦 Project Structure

```
flowbit-assignment/
├── apps/
│   ├── api/              # Express Backend API
│   │   ├── src/
│   │   │   ├── routes/   # 7 API endpoints
│   │   │   ├── services/ # Mock data & business logic
│   │   │   └── index.ts  # Server entry point
│   │   └── package.json
│   └── web/              # React Frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── dashboard/  # Dashboard components
│       │   │   └── chat/       # Chat interface
│       │   ├── services/       # API integration
│       │   └── types/          # TypeScript interfaces
│       └── package.json
├── services/
│   └── vanna/            # Vanna AI Python service
│       ├── app.py        # FastAPI server
│       └── requirements.txt
└── Data/
    └── Analytics_Test_Data.json
```

## 🔌 API Endpoints

All endpoints available at `http://localhost:3000/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/stats` | GET | Dashboard overview statistics |
| `/invoices` | GET | List invoices (searchable, sortable) |
| `/invoice-trends` | GET | Monthly invoice trends |
| `/vendors/top10` | GET | Top 10 vendors by spend |
| `/category-spend` | GET | Spend breakdown by category |
| `/cash-outflow` | GET | Cash outflow forecast |
| `/chat-with-data` | POST | Natural language queries |

## 💬 Chat Interface

The chat interface supports natural language queries like:

- "What's the total spend?"
- "How many invoices are pending?"
- "Show me the top vendor by spend"
- "What's the average invoice value?"
- "Breakdown spend by category"

**Current Mode**: Simulated AI responses (works without database)

**Full AI Mode** (requires setup):
1. Get Groq API key from https://console.groq.com
2. Setup PostgreSQL database
3. Configure `services/vanna/.env`
4. Run Python service

## 🛠️ Technology Stack

### Frontend
- React 19.1 + TypeScript
- Vite (build tool)
- Tailwind CSS v3.4.1
- Recharts (data visualization)
- Lucide React (icons)
- date-fns (date formatting)

### Backend
- Node.js + Express
- TypeScript
- CORS enabled
- Mock data service

### AI Service (Optional)
- Python + FastAPI
- Vanna AI (SQL generation)
- Groq (LLM provider)
- PostgreSQL (database)

## 📊 Data Flow

```
User Query → Frontend (React)
    ↓
Backend API (Express) → /chat-with-data
    ↓
Vanna AI Service (Python) → Generate SQL
    ↓
PostgreSQL → Execute Query
    ↓
Results → Frontend → Display Table
```

## 🔧 Configuration

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:3000
```

### Backend `.env`
```
PORT=3000
VANNA_API_BASE_URL=http://localhost:8000
DATABASE_URL=postgresql://user:pass@localhost:5432/flowbit_db
```

### Vanna AI `.env`
```
PORT=8000
GROQ_API_KEY=your_key_here
DATABASE_URL=postgresql://user:pass@localhost:5432/flowbit_db
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop and tablet
- **Real-time Search**: Filter invoices instantly
- **Sortable Tables**: Click headers to sort
- **Status Badges**: Color-coded (Paid, Pending, Overdue)
- **Trend Indicators**: Up/down arrows with percentages
- **Interactive Charts**: Hover for details

## 🧪 Testing

The application works immediately with **mock data**:
- 10 sample invoices
- Realistic vendor names
- Multiple categories
- Various statuses

No database setup required for testing!

## 📝 Notes

- Backend API uses mock data by default
- Chat interface has simulated AI responses
- Full AI features require Groq API key + PostgreSQL
- All components are TypeScript typed
- Error handling with graceful fallbacks

## 🚧 Future Enhancements

- Real PostgreSQL database integration
- User authentication
- File upload for invoice processing
- Advanced filtering and date ranges
- Export to CSV/PDF
- Email notifications
- Multi-tenant support

## 📄 License

MIT

## 👤 Author

REHAN

---

**Need help?** Check the documentation in each service folder:
- `apps/api/README.md` - Backend API docs
- `services/vanna/README.md` - Vanna AI setup guide
