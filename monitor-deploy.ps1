# Monitor para deployment de Render
Write-Host "🔍 MONITOR DE DEPLOYMENT - SGTS FARMASHAIO`n" -ForegroundColor Cyan
Write-Host "Esperando a que Render despliegue el commit 5e46fbd...`n" -ForegroundColor Yellow

$maxAttempts = 20
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "[$attempt/$maxAttempts] Probando..." -ForegroundColor Gray
    
    try {
        # Login
        $loginResp = Invoke-RestMethod -Uri 'https://sgts-farmashaio-api.onrender.com/api/auth/login' `
            -Method POST `
            -Headers @{'Content-Type'='application/json'} `
            -Body '{"email":"admin@farmashaio.com","password":"admin123"}' `
            -ErrorAction Stop
        
        $token = $loginResp.data.token
        
        # Intentar cambiar estado
        $statusResp = Invoke-RestMethod -Uri 'https://sgts-farmashaio-api.onrender.com/api/tickets/1/status' `
            -Method PATCH `
            -Headers @{'Content-Type'='application/json';'Authorization'="Bearer $token"} `
            -Body '{"status":"550e8400-e29b-41d4-a716-446655442002","comment":"Test monitoring"}' `
            -ErrorAction Stop
        
        Write-Host "`n✅ ¡FUNCIONA!" -ForegroundColor Green
        Write-Host "   Mensaje: $($statusResp.message)" -ForegroundColor Gray
        Write-Host "   Estado: $($statusResp.ticket.status.name)" -ForegroundColor Cyan
        Write-Host "`n🎉 DEPLOYMENT COMPLETADO Y FUNCIONANDO!" -ForegroundColor Green
        break
        
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 500) {
            Write-Host "   ❌ Aún con error 500 - Deploy pendiente" -ForegroundColor Red
        } else {
            Write-Host "   ⚠️  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        }
        
        if ($attempt -lt $maxAttempts) {
            Write-Host "   Esperando 30 segundos...`n" -ForegroundColor Gray
            Start-Sleep -Seconds 30
        }
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "`n⚠️  Tiempo de espera agotado" -ForegroundColor Yellow
    Write-Host "Ve a Render Dashboard y verifica el deployment manualmente" -ForegroundColor Yellow
}
