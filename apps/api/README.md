# Flowbit API Server

Backend API for the Flowbit Invoice Analytics Dashboard with Chat-with-Data functionality.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd apps/api
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/flowbit_db
VANNA_API_BASE_URL=http://localhost:8000
PORT=3000
```

### 3. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/stats` | GET | Dashboard overview stats |
| `/api/invoices` | GET | List invoices with search/filter |
| `/api/invoice-trends` | GET | Monthly invoice trends |
| `/api/vendors/top10` | GET | Top 10 vendors by spend |
| `/api/category-spend` | GET | Spend by category |
| `/api/cash-outflow` | GET | Cash outflow forecast |
| `/api/chat-with-data` | POST | Natural language query → SQL + results |

## 🗄️ Database Setup

The API expects a PostgreSQL database with invoice data. Run migrations (TBD) or import test data.

## 🤖 Vanna AI Integration

The `/api/chat-with-data` endpoint requires a running Vanna AI service. See `services/vanna/README.md` for setup.

## 📦 Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **pg** - PostgreSQL client
- **tsx** - TypeScript execution (dev)

## 🛠️ Development

- Run in watch mode: `npm run dev`
- TypeScript compilation: `npm run build`
- Check types: `npx tsc --noEmit`
