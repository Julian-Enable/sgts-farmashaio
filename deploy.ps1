# Script de deployment para SGTS FARMASHAIO - PowerShell

Write-Host "🚀 SGTS FARMASHAIO - Script de Deployment" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# 1. Verificar Git
Write-Host "📋 Verificando estado de Git..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "❌ Hay cambios sin commitear. Por favor commitea todos los cambios antes de hacer deployment." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git está limpio, continuando..." -ForegroundColor Green

# 2. Push a GitHub
Write-Host "📤 Subiendo cambios a GitHub..." -ForegroundColor Yellow
git push origin main

# 3. Mostrar instrucciones
Write-Host ""
Write-Host "🔥 RENDER - Backend API" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host "1. Ve a https://render.com y crea una cuenta"
Write-Host "2. Conecta tu repositorio GitHub"
Write-Host "3. Crea una nueva PostgreSQL Database:"
Write-Host "   - Name: sgts-farmashaio-db"
Write-Host "   - Plan: Free"
Write-Host "4. Crea un nuevo Web Service:"
Write-Host "   - Repository: Julian-Enable/sgts-farmashaio"
Write-Host "   - Root Directory: backend"  -ForegroundColor Yellow
Write-Host "   - Build Command: npm install"
Write-Host "   - Start Command: npm start"
Write-Host "5. Configura estas variables de entorno:"
Write-Host "   - NODE_ENV=production"
Write-Host "   - DATABASE_URL=[auto from database]"
Write-Host "   - JWT_SECRET=[generate random]"
Write-Host "   - CORS_ORIGINS=https://sgts-farmashaio.vercel.app"

Write-Host ""
Write-Host "⚡ VERCEL - Frontend" -ForegroundColor Magenta
Write-Host "===================" -ForegroundColor Magenta
Write-Host "1. Ve a https://vercel.com y crea una cuenta"
Write-Host "2. Conecta tu repositorio GitHub"
Write-Host "3. Configura el proyecto:"
Write-Host "   - Framework: Vite"
Write-Host "   - Root Directory: frontend" -ForegroundColor Yellow
Write-Host "   - Build Command: npm run build"
Write-Host "   - Output Directory: dist"
Write-Host "4. Configura esta variable de entorno:"
Write-Host "   - VITE_API_BASE_URL=https://[tu-backend-url].onrender.com/api"

Write-Host ""
Write-Host "📋 CHECKLIST POST-DEPLOYMENT" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host "☐ 1. Database PostgreSQL creada en Render"
Write-Host "☐ 2. Backend deployado en Render"
Write-Host "☐ 3. Ejecutar schema SQL en la base de datos"
Write-Host "☐ 4. Frontend deployado en Vercel"
Write-Host "☐ 5. Probar login con: admin@farmashaio.com / admin123"

Write-Host ""
Write-Host "✅ ¡Listo para deployment! Sigue las instrucciones de arriba." -ForegroundColor Green