@echo off
setlocal

call npm run build
if errorlevel 1 exit /b %errorlevel%

node scripts\run-playwright-with-server.mjs --skip-build %*
