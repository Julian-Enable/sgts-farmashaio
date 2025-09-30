#!/bin/bash
# Script de deployment para SGTS FARMASHAIO

echo "🚀 SGTS FARMASHAIO - Script de Deployment"
echo "=========================================="

# 1. Verificar que estemos en git y que todo esté commiteado
echo "📋 Verificando estado de Git..."
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Hay cambios sin commitear. Por favor commitea todos los cambios antes de hacer deployment."
    exit 1
fi

echo "✅ Git está limpio, continuando..."

# 2. Push a GitHub
echo "📤 Subiendo cambios a GitHub..."
git push origin main

# 3. Instrucciones para Render
echo ""
echo "🔥 RENDER - Backend API"
echo "======================="
echo "1. Ve a https://render.com y crea una cuenta"
echo "2. Conecta tu repositorio GitHub"
echo "3. Crea una nueva PostgreSQL Database:"
echo "   - Name: sgts-farmashaio-db"
echo "   - Plan: Free"
echo "4. Crea un nuevo Web Service:"
echo "   - Repository: tu-usuario/sgts-farmashaio"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "5. Configura las variables de entorno en Render Dashboard"

# 4. Instrucciones para Vercel
echo ""
echo "⚡ VERCEL - Frontend"
echo "==================="
echo "1. Ve a https://vercel.com y crea una cuenta"
echo "2. Conecta tu repositorio GitHub"
echo "3. Configura el proyecto:"
echo "   - Framework: Vite"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo "4. Configura las variables de entorno en Vercel Dashboard"

echo ""
echo "✅ Deployment iniciado! Sigue las instrucciones arriba."