@echo off

echo Starting Deepfake AI Project...

start "Flask Backend" cmd /k "cd /d C:\Users\venka\OneDrive\Desktop\DeepfakeVideoDetection\backend && venv\Scripts\activate && python app.py"

timeout /t 5 /nobreak >nul

start "React Frontend" cmd /k "cd /d C:\Users\venka\OneDrive\Desktop\DeepfakeVideoDetection\frontend && npm run dev"

echo Project started.