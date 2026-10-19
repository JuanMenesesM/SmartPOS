# 🚀 GUÍA DE RESTAURACIÓN TOTAL — SMARTPOS

**Fecha de Respaldo:** 19 de Octubre de 2026  
**Super Usuario:** Juan Jose Meneses Monsalve  
**Correo:** `juan_meneses82192@elpoli.edu.co`  
**Contraseña:** `Juanjose2026++`  

Este paquete contiene **TODO** lo necesario para restaurar y levantar el proyecto SmartPOS en un nuevo computador sin perder configuraciones, base de datos ni código.

---

## 📦 Contenido de este Respaldo

| Archivo / Carpeta | Descripción |
|---|---|
| `SmartPOS_database_backup.sql` | Respaldo SQL completo de PostgreSQL (tablas, secuencias desde 1, roles y Super Usuario). |
| `api.env` | Archivo de variables de entorno con todas las claves, tokens y conexiones del backend. |
| `SmartPOS_repo_offline.bundle` | Copia binaria offline de todo el repositorio Git (código completo, ramas e historial). |
| `n8n/` | Base de datos SQLite y configuración de n8n con los flujos de WhatsApp y webhooks. |
| `evolution/` | Configuración de Evolution API (`docker-compose.yml` y generador QR). |

---

## 🛠️ Paso a Paso para Restaurar en el Nuevo PC

### Paso 1: Requisitos previos en el nuevo equipo
Instala (si aún no los tienes):
- **Node.js** (v20 LTS o superior): [https://nodejs.org/](https://nodejs.org/)
- **Git**: [https://git-scm.com/](https://git-scm.com/)
- **PostgreSQL** (v16 o v18): [https://www.postgresql.org/](https://www.postgresql.org/)
  * Durante la instalación, ponle la contraseña a `postgres` (se utilizó `Juan123`).

---

### Paso 2: Descargar el código fuente

#### Opción A (Recomendada — Vía GitHub)
Abre PowerShell o terminal y ejecuta:
```bash
git clone https://github.com/JuanMenesesM/SmartPOS.git
cd SmartPOS
```

#### Opción B (Offline — Usando el archivo Bundle incluido)
```bash
git clone SmartPOS_repo_offline.bundle SmartPOS
cd SmartPOS
```

---

### Paso 3: Restaurar las variables de entorno (`.env`)
1. Toma el archivo `api.env` incluido en este respaldo.
2. Cópialo dentro de la carpeta `SmartPOS/api/` y renómbralo como:
   ```
   .env
   ```

---

### Paso 4: Restaurar la base de datos PostgreSQL
1. Abre tu terminal o pgAdmin.
2. Crea la base de datos `SmartPOS`:
   ```bash
   psql -U postgres -c "CREATE DATABASE \"SmartPOS\";"
   ```
3. Restaura el archivo SQL con todos los datos y el usuario superadmin:
   ```bash
   psql -U postgres -d SmartPOS -f SmartPOS_database_backup.sql
   ```
*(La base de datos quedará lista con tu usuario administrador creado y todas las secuencias listas para que el primer cliente tenga ID: 1).*

---

### Paso 5: Restaurar los flujos de n8n (Opcional)
1. Ve a la carpeta de tu usuario en el nuevo PC:
   `C:\Users\<TuUsuario>\.n8n\` (si no existe, créala).
2. Copia los archivos dentro de la carpeta `n8n` (`database.sqlite` y `config`) ahí dentro.
3. Para iniciar n8n, ejecuta:
   ```bash
   npx n8n start
   ```

---

### Paso 6: Instalar dependencias y encender el proyecto
1. **Backend:**
   ```bash
   cd SmartPOS/api
   npm install
   npm run dev
   ```
   *Estará activo en `http://localhost:3000`*

2. **Frontend:**
   ```bash
   cd SmartPOS/web
   npm install
   npm run dev
   ```
   *Estará activo en `http://localhost:5173`*

3. **Iniciar sesión en la web:**
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador e ingresa con:
   - **Correo:** `juan_meneses82192@elpoli.edu.co`
   - **Contraseña:** `Juanjose2026++`

---
🎉 **¡Listo! Tu entorno estará 100% operativo tal como lo dejaste.**
