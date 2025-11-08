@echo off
echo ====================================
echo Starting Flowbit Application
echo ====================================
echo.

echo [1/3] Starting Backend API...
start "API Server" cmd /k "cd apps\api && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend...
start "Frontend" cmd /k "cd apps\web && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Ready!
echo.
echo ====================================
echo Services Running:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:3000
echo ====================================
echo.
echo Optional: To enable AI chat features,
echo run Python service:
echo   cd services\vanna
echo   pip install -r requirements.txt
echo   python app.py
echo.
pause
