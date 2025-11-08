Write-Host "Testing API Endpoints..." -ForegroundColor Cyan
Write-Host ""

# Test Health
Write-Host "1. Testing /health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
    Write-Host "✅ Health check passed" -ForegroundColor Green
    Write-Host ($health | ConvertTo-Json)
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test Stats
Write-Host "2. Testing /api/stats endpoint..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:3000/api/stats" -Method Get
    Write-Host "✅ Stats endpoint passed" -ForegroundColor Green
    Write-Host ($stats | ConvertTo-Json)
} catch {
    Write-Host "❌ Stats endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test Invoices
Write-Host "3. Testing /api/invoices endpoint..." -ForegroundColor Yellow
try {
    $invoices = Invoke-RestMethod -Uri "http://localhost:3000/api/invoices?limit=5" -Method Get
    Write-Host "✅ Invoices endpoint passed" -ForegroundColor Green
    Write-Host "Found $($invoices.Count) invoices"
} catch {
    Write-Host "❌ Invoices endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test Vendors
Write-Host "4. Testing /api/vendors/top10 endpoint..." -ForegroundColor Yellow
try {
    $vendors = Invoke-RestMethod -Uri "http://localhost:3000/api/vendors/top10" -Method Get
    Write-Host "✅ Vendors endpoint passed" -ForegroundColor Green
    Write-Host "Found $($vendors.Count) vendors"
} catch {
    Write-Host "❌ Vendors endpoint failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing complete!" -ForegroundColor Cyan
