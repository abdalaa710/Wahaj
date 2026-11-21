@echo off
chcp 65001 >nul
title WAHAJ Scientific Backend (FastAPI + SQLite)
cd /d "%~dp0"

echo =======================================================
echo   جاري تشغيل سيرفر الباك إند وقاعدة البيانات...
echo   WAHAJ NASA Combustion Research Backend API
echo =======================================================
echo.

:: Check if fastapi is installed, if not install it
python -c "import fastapi, uvicorn" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [تنبيه] جاري تثبيت متطلبات السيرفر لأول مرة...
    pip install fastapi uvicorn
)

echo.
echo [تم] السيرفر يعمل الآن!
echo رابط لوحة التحكم وتجربة الـ API: http://127.0.0.1:8000/docs
echo.

:: Open docs in browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://127.0.0.1:8000/docs"

:: Run server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
if %ERRORLEVEL% NEQ 0 (
    py -3.11 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
)

pause
