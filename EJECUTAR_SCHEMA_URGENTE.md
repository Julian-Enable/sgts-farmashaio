# 🚨 SOLUCIÓN URGENTE: Base de Datos Vacía

## 🔍 **PROBLEMA IDENTIFICADO:**

```
❌ Error: relation "users" does not exist
```

**La base de datos en Render está VACÍA.** Las tablas no se crearon correctamente.

---

## ✅ **SOLUCIÓN: Ejecutar Schema desde Render Shell**

### **MÉTODO 1: Usar Render Shell (Recomendado)**

1. **Ve a Render Dashboard:**
   ```
   https://dashboard.render.com
   ```

2. **Selecciona tu base de datos:**
   - Click en: `sgts-farmashaio-db`

3. **Abre el Shell:**
   - En la parte superior, busca el botón: **"Shell"** o **"Connect"**
   - Click ahí
   - Se abrirá una terminal interactiva

4. **Copia y pega el schema SQL:**
   - Abre el archivo: `database/production_schema.sql`
   - **COPIA TODO EL CONTENIDO** (Ctrl+A, Ctrl+C)
   - **PEGA** en el shell de Render
   - Presiona Enter

5. **Verifica que se ejecutó:**
   - Deberías ver mensajes como:
     ```
     CREATE EXTENSION
     CREATE TABLE
     INSERT 0 3
     INSERT 0 6
     ...
     ```

---

### **MÉTODO 2: Usar Render Query Tab (Más Fácil)**

1. **Ve a tu base de datos en Render:**
   - Dashboard → `sgts-farmashaio-db`

2. **Busca la pestaña "Query" o "SQL":**
   - Puede estar en el menú superior

3. **Abre el archivo local:**
   ```
   C:\Users\Desktop\Desktop\sgtsFarmashaio\database\production_schema.sql
   ```

4. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)

5. **Pega en el Query Editor de Render**

6. **Click en "Execute" o "Run"**

7. **Espera 10-20 segundos** mientras se ejecuta

---

### **MÉTODO 3: Instalar PostgreSQL Client (Si los otros fallan)**

1. **Instala PostgreSQL:**
   ```powershell
   winget install PostgreSQL.PostgreSQL
   ```

2. **Cierra y abre PowerShell de nuevo**

3. **Ejecuta el schema:**
   ```powershell
   cd C:\Users\Desktop\Desktop\sgtsFarmashaio
   
   PGPASSWORD=OtfEGRj0XljH4C7HTvItnKUHwL3742iQ psql -h dpg-d3n8dpi4d50c73f43kr0-a.oregon-postgres.render.com -U sgts_user sgts_farmashaio_u3b7 < database/production_schema.sql
   ```

---

### **MÉTODO 4: Usar DBeaver (GUI - Más Visual)**

1. **Descarga DBeaver:**
   ```
   https://dbeaver.io/download/
   ```

2. **Instala y abre DBeaver**

3. **Crea nueva conexión PostgreSQL:**
   - File → New → Database Connection
   - Selecciona: PostgreSQL
   - Click: Next

4. **Configura la conexión:**
   ```
   Host: dpg-d3n8dpi4d50c73f43kr0-a.oregon-postgres.render.com
   Port: 5432
   Database: sgts_farmashaio_u3b7
   Username: sgts_user
   Password: OtfEGRj0XljH4C7HTvItnKUHwL3742iQ
   ```

5. **Test Connection** → Si funciona, click **Finish**

6. **Ejecuta el schema:**
   - File → Open File
   - Selecciona: `database/production_schema.sql`
   - Click en el botón: **Execute SQL Script** (▶️)
   - Espera que termine

7. **Verifica las tablas:**
   - Expande tu conexión en el navegador izquierdo
   - Ve a: Databases → sgts_farmashaio_u3b7 → Schemas → public → Tables
   - Deberías ver: users, tickets, categories, priorities, ticket_statuses, comments, ticket_history, notifications

---

## 🎯 **VERIFICACIÓN RÁPIDA:**

Después de ejecutar el schema, verifica en Render Shell:

```sql
-- Ver tablas creadas
\dt

-- Ver usuarios
SELECT username, email, role FROM users;

-- Deberías ver 3 usuarios:
-- admin@farmashaio.com
-- tecnico1@farmashaio.com
-- empleado1@farmashaio.com
```

---

## ✅ **DESPUÉS DE EJECUTAR EL SCHEMA:**

1. **Espera 1 minuto**

2. **Ve a tu frontend:**
   ```
   https://sgts-farmashaio-3pj5.vercel.app/login
   ```

3. **Refresca la página** (F5)

4. **Intenta login:**
   ```
   Email: admin@farmashaio.com
   Password: admin123
   ```

5. **¡Debería funcionar!** ✅

---

## 🆘 **SI NECESITAS AYUDA:**

Dime cuál método prefieres:
- Método 1: Render Shell
- Método 2: Render Query Tab
- Método 3: Instalar PostgreSQL
- Método 4: DBeaver (GUI)

Y te guío paso a paso con ese método específico.

---

## 📊 **ESTADO ACTUAL:**

```
✅ Backend: Funcionando (CORS OK)
✅ Frontend: Funcionando  
❌ Base de Datos: Vacía (sin tablas)
```

**Siguiente paso:** Ejecutar el schema para crear las tablas.

---

**¿Cuál método prefieres usar?** 🚀
