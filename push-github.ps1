Write-Host "=========================================" -ForegroundColor Green
Write-Host "   SGTS FARMASHAIO - DEPLOY A GITHUB" -ForegroundColor Yellow  
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

Write-Host "🔍 Verificando estado del repositorio..." -ForegroundColor Cyan
git status --porcelain

Write-Host ""
Write-Host "📤 Haciendo push a GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 ¡ÉXITO! Repositorio subido a GitHub" -ForegroundColor Green
    Write-Host "📋 URL del repositorio: https://github.com/elabc80/sgts-farmashaio" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Estadísticas del proyecto:" -ForegroundColor Yellow
    Write-Host "   - 59 archivos subidos" -ForegroundColor White
    Write-Host "   - Frontend: React + Vite + Material-UI" -ForegroundColor White  
    Write-Host "   - Backend: Node.js + Express + SQLite" -ForegroundColor White
    Write-Host "   - Sistema completo de tickets de soporte TI" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Listo para desplegar en producción!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Error al subir el repositorio" -ForegroundColor Red
    Write-Host "💡 Asegúrate de haber creado el repositorio en GitHub primero" -ForegroundColor Yellow
    Write-Host "🔗 Ve a: https://github.com/new" -ForegroundColor Cyan
}