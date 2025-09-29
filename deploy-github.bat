@echo off
echo ===========================================
echo   SGTS FARMASHAIO - Despliegue a GitHub
echo ===========================================
echo.
echo INSTRUCCIONES:
echo 1. Ve a https://github.com y crea un nuevo repositorio llamado "sgts-farmashaio"
echo 2. NO agregues README, .gitignore o licencia (ya los tenemos)
echo 3. Copia la URL del repositorio (ejemplo: https://github.com/tu-usuario/sgts-farmashaio.git)
echo 4. Ejecuta estos comandos reemplazando TU-USUARIO con tu usuario de GitHub:
echo.
echo    git remote add origin https://github.com/TU-USUARIO/sgts-farmashaio.git
echo    git push -u origin main
echo.
echo ===========================================
echo   Proyecto listo para GitHub!
echo ===========================================
echo.
echo Estado actual del repositorio:
git status --porcelain
echo.
echo Archivos en el commit:
git show --stat --oneline HEAD
echo.
echo Para pushear a GitHub, ejecuta:
echo   git remote add origin https://github.com/TU-USUARIO/sgts-farmashaio.git
echo   git push -u origin main
echo.
pause