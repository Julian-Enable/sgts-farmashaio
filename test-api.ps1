# Script para probar la API de SGTS FARMASHAIO
# Asegúrate de estar logueado en la aplicación web primero para obtener tu token

Write-Host "🧪 PRUEBA DE API - SGTS FARMASHAIO" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1️⃣ Verificando salud del backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri 'https://sgts-farmashaio-api.onrender.com/health'
    Write-Host "✅ Backend: $($health.status) - $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Login (usa las credenciales correctas)
Write-Host "2️⃣ Obteniendo token de autenticación..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@farmashaio.com"  # Usuario administrador del sistema
    password = "Admin123!"           # Password por defecto
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri 'https://sgts-farmashaio-api.onrender.com/api/auth/login' `
        -Method POST `
        -Headers @{'Content-Type'='application/json'} `
        -Body $loginBody
    
    $token = $loginResponse.data.token
    Write-Host "✅ Token obtenido correctamente" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResponse.data.user.firstName) $($loginResponse.data.user.lastName)" -ForegroundColor Gray
    Write-Host "   Role: $($loginResponse.data.user.role)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error en login: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Headers para las siguientes peticiones
$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = "Bearer $token"
}

# 3. Obtener lista de tickets
Write-Host "3️⃣ Obteniendo lista de tickets..." -ForegroundColor Yellow
try {
    $ticketsResponse = Invoke-RestMethod -Uri 'https://sgts-farmashaio-api.onrender.com/api/tickets' `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Tickets encontrados: $($ticketsResponse.tickets.Count)" -ForegroundColor Green
    
    if ($ticketsResponse.tickets.Count -gt 0) {
        $firstTicket = $ticketsResponse.tickets[0]
        Write-Host "   Primer ticket: #$($firstTicket.ticketNumber) - $($firstTicket.title)" -ForegroundColor Gray
        $ticketId = $firstTicket.id
    } else {
        Write-Host "⚠️ No hay tickets para probar" -ForegroundColor Yellow
        exit 0
    }
} catch {
    Write-Host "❌ Error obteniendo tickets: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 4. Obtener técnicos
Write-Host "4️⃣ Obteniendo lista de técnicos..." -ForegroundColor Yellow
try {
    $techResponse = Invoke-RestMethod -Uri 'https://sgts-farmashaio-api.onrender.com/api/users/technicians' `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Técnicos encontrados: $($techResponse.data.technicians.Count)" -ForegroundColor Green
    
    if ($techResponse.data.technicians.Count -gt 0) {
        $firstTech = $techResponse.data.technicians[0]
        Write-Host "   Primer técnico: $($firstTech.name) ($($firstTech.role))" -ForegroundColor Gray
        $technicianId = $firstTech.id
    }
} catch {
    Write-Host "❌ Error obteniendo técnicos: $_" -ForegroundColor Red
}

Write-Host ""

# 5. Asignar ticket
if ($technicianId) {
    Write-Host "5️⃣ Probando asignación de ticket..." -ForegroundColor Yellow
    $assignBody = @{
        assignedTo = $technicianId
    } | ConvertTo-Json
    
    try {
        $assignResponse = Invoke-RestMethod -Uri "https://sgts-farmashaio-api.onrender.com/api/tickets/$ticketId/assign" `
            -Method POST `
            -Headers $headers `
            -Body $assignBody
        
        Write-Host "✅ Ticket asignado correctamente" -ForegroundColor Green
        Write-Host "   Mensaje: $($assignResponse.message)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Error asignando ticket: $_" -ForegroundColor Red
        Write-Host "   Detalles: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host ""

# 6. Cambiar estado
Write-Host "6️⃣ Probando cambio de estado..." -ForegroundColor Yellow
$statusBody = @{
    status = "550e8400-e29b-41d4-a716-446655442003"  # En Progreso
    comment = "Estado cambiado desde prueba de API"
} | ConvertTo-Json

try {
    $statusResponse = Invoke-RestMethod -Uri "https://sgts-farmashaio-api.onrender.com/api/tickets/$ticketId/status" `
        -Method PATCH `
        -Headers $headers `
        -Body $statusBody
    
    Write-Host "✅ Estado cambiado correctamente" -ForegroundColor Green
    Write-Host "   Mensaje: $($statusResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error cambiando estado: $_" -ForegroundColor Red
    Write-Host "   Detalles: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🏁 PRUEBAS COMPLETADAS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
