# Script simple para probar cambio de estado sin login previo
Write-Host "🔐 Probando con técnico1..." -ForegroundColor Cyan

# Intentar login con técnico
$loginBody = @{
    email = "tecnico1@farmashaio.com"
    password = "Tecnico123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri 'https://sgts-farmashaio-api.onrender.com/api/auth/login' `
        -Method POST `
        -Headers @{'Content-Type'='application/json'} `
        -Body $loginBody -ErrorAction Stop
    
    $token = $loginResponse.data.token
    Write-Host "✅ Login exitoso: $($loginResponse.data.user.firstName)" -ForegroundColor Green
    
    # Ahora intentar cambiar estado
    $headers = @{
        'Content-Type' = 'application/json'
        'Authorization' = "Bearer $token"
    }
    
    Write-Host "`n📝 Intentando cambiar estado del ticket 1..." -ForegroundColor Cyan
    
    $statusBody = @{
        status = "550e8400-e29b-41d4-a716-446655442002"  # Asignado
        comment = "Cambio de estado desde prueba PowerShell"
    } | ConvertTo-Json
    
    $statusResponse = Invoke-RestMethod -Uri 'https://sgts-farmashaio-api.onrender.com/api/tickets/1/status' `
        -Method PATCH `
        -Headers $headers `
        -Body $statusBody -ErrorAction Stop
    
    Write-Host "✅ Estado cambiado exitosamente!" -ForegroundColor Green
    Write-Host "   Mensaje: $($statusResponse.message)" -ForegroundColor Gray
    Write-Host "   Nuevo estado: $($statusResponse.ticket.status.name)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
