# Flowbit Analytics Dashboard

A pixel-perfect recreation of the Figma dashboard design with fully functional analytics features.

## ✨ Features Implemented

### Overview Cards
- **Total Spend (YTD)** - Shows year-to-date total spending with percentage change
- **Total Invoices Processed** - Count of processed invoices with trend indicator
- **Documents Uploaded** - Monthly document upload count
- **Average Invoice Value** - Mean invoice value with change percentage

### Interactive Charts

#### 1. Invoice Volume + Value Trend (Line Chart)
- Dual-axis line chart showing invoice count and total spend over 12 months
- Interactive tooltips with formatted currency values
- Color-coded lines for easy differentiation
- Current month statistics displayed prominently

#### 2. Spend by Vendor (Top 10 - Horizontal Bar Chart)
- Top 10 vendors by spending amount
- Cumulative percentage distribution
- Color gradient for visual hierarchy
- Hover tooltips showing exact amounts and percentages

#### 3. Spend by Category (Pie Chart)
- Doughnut chart with three categories: Operations, Marketing, Facilities
- Auto-categorization based on invoice descriptions
- Legend with percentages
- Detailed breakdown below chart

#### 4. Cash Outflow Forecast (Bar Chart)
- Payment obligations grouped by due date ranges:
  - 0-7 days
  - 8-30 days
  - 31-60 days
  - 60+ days
- Helps with cash flow planning

#### 5. Invoices Table
- ✅ **Searchable** - Filter by vendor name or invoice number
- ✅ **Sortable** - Click column headers to sort by vendor, date, invoice number, amount, status
- ✅ **Scrollable** - Fixed header with scrolling body
- Displays: Vendor, Date, Invoice #, Amount, Status badge

## 🛠️ Tech Stack

- **React 19.1** with TypeScript
- **Vite** for fast dev builds
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **date-fns** for date formatting

## 🚀 Getting Started

```bash
npm install
npm run dev:web
```

Visit `http://localhost:5173` to see the dashboard.

## 📊 API Integration

### Expected Endpoint
```
GET /invoices
```

The dashboard fetches data from the backend and calculates all metrics dynamically.
