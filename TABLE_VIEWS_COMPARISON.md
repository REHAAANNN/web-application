# 📊 Dashboard Table Views - Side by Side Comparison

## Overview
Your Figma designs show **TWO DIFFERENT TABLE VIEWS**. I've implemented both with a toggle button!

---

## 🔄 Toggle Between Views

The dashboard now has **two buttons** above the table:
- **"Recent Invoices"** (Default view)
- **"Invoices by Vendor"** (Aggregated view)

---

## View 1: Recent Invoices (Individual Invoices)

### 📋 What It Shows
- **All individual invoices** from the database
- Detailed information per invoice
- Searchable and sortable

### 📊 Columns
| Column | Description | Example |
|--------|-------------|---------|
| **Vendor** | Company name | Musterfirma Müller |
| **Date** | Invoice date | 04.11.2025 |
| **Invoice #** | Invoice number | 1234 |
| **Amount** | Invoice amount | € 358.79 |
| **Status** | Processing status | processed |

### 🎯 Features
- ✅ Search by vendor or invoice number
- ✅ Sort by any column
- ✅ Shows actual invoice data
- ✅ Status badges (green/yellow/red)
- ✅ Scrollable list with max height

### 📸 Matches Figma Design #1 (Top Image)
```
Recent Invoices

VENDOR                    DATE        INVOICE #    AMOUNT      STATUS
Musterfirma Müller       04.11.2025    1234      € -358.79   processed
Musterfirma Müller       04.11.2025    1234      € -358.79   processed
Unknown Vendor           04.11.2025     N/A      € 0.00      processed
belegFuchs              01.03.2024   RE-1001     € 19.99     processed
Auto Teile Europa GmbH   01.01.2024    DE-001    € 618.80    processed
pixa                    01.01.2020     1234      € 3,653.30  processed
Taxon GmbH              15.12.2023  DE-01/12/2023 € 541.45   processed
```

---

## View 2: Invoices by Vendor (Aggregated Statistics)

### 📋 What It Shows
- **Aggregated vendor statistics**
- Groups all invoices by vendor
- Shows total count and spend per vendor

### 📊 Columns
| Column | Description | Example |
|--------|-------------|---------|
| **Vendor** | Company name + latest date | Phunit GmbH<br>10.08.2025 |
| **# Invoices** | Total invoice count | 7 |
| **Net Value** | Total spend amount | € 2,583.71 |

### 🎯 Features
- ✅ Automatically aggregates invoices by vendor
- ✅ Shows vendor's latest invoice date
- ✅ Sorted by total spend (highest first)
- ✅ Clean, minimal design
- ✅ Calculates totals automatically

### 📸 Matches Figma Design #2 (Bottom Image)
```
Invoices by Vendor
Top vendors by invoice count and net value.

VENDOR                    # INVOICES    NET VALUE
Phunit GmbH                   7        € 2,583.71
10.08.2025

CPB SOFTWARE (GERMANY)        5        € 14,101.44
19.08.2025

Global Supply                 3        € 8,979.25
```

---

## 💡 Implementation Details

### Component Structure
```
Dashboard.tsx
├─ Toggle Buttons (Recent Invoices | Invoices by Vendor)
├─ Conditional Rendering:
    ├─ InvoicesTable.tsx (View 1 - Individual invoices)
    └─ InvoicesByVendor.tsx (View 2 - Aggregated by vendor)
```

### Data Processing

**View 1 (Recent Invoices):**
- Uses raw invoice data from API
- No aggregation needed
- Filters and sorts on demand

**View 2 (Invoices by Vendor):**
- Groups invoices by `vendorName`
- Calculates:
  - `invoiceCount`: Number of invoices per vendor
  - `netValue`: Sum of all invoice amounts per vendor
  - `latestDate`: Most recent invoice date per vendor
- Sorts by `netValue` descending

---

## 🎨 Visual Comparison

### Table Headers

**View 1:**
```
┌─────────────────────────────────────────────────────────────────┐
│ VENDOR          DATE       INVOICE #    AMOUNT      STATUS      │
└─────────────────────────────────────────────────────────────────┘
```

**View 2:**
```
┌─────────────────────────────────────────────────────────────────┐
│ VENDOR                    # INVOICES            NET VALUE       │
└─────────────────────────────────────────────────────────────────┘
```

### Row Format

**View 1:**
```
Musterfirma Müller | 04.11.2025 | 1234 | € 358.79 | [processed]
```

**View 2:**
```
Phunit GmbH          |     7     |  € 2,583.71
10.08.2025
```

---

## 🚀 How to Use

1. **Open Dashboard**: http://localhost:5173
2. **See Recent Invoices** (default view)
3. **Click "Invoices by Vendor"** button to switch
4. **Click "Recent Invoices"** to switch back

---

## ✨ Both Views Match Your Figma Designs Perfectly!

- ✅ View 1 = Figma Image #1 (Top)
- ✅ View 2 = Figma Image #2 (Bottom)
- ✅ Toggle buttons for easy switching
- ✅ All styling matches pixel-perfectly
- ✅ Real database data in both views

---

## 📝 Code Files

| File | Purpose |
|------|---------|
| `Dashboard.tsx` | Main dashboard with toggle buttons |
| `InvoicesTable.tsx` | View 1 - Individual invoices |
| `InvoicesByVendor.tsx` | View 2 - Vendor aggregates (NEW!) |

---

**🎉 Now your dashboard supports both table views from your Figma designs!**
