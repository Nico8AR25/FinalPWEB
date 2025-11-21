# 🗄️ CONFIGURACIÓN DE BASE DE DATOS - STREAMBOOST

## 📋 PASOS PARA CONFIGURAR LA BASE DE DATOS

### 1️⃣ INSTALAR POSTGRESQL

Si no tienes PostgreSQL instalado:

**Windows:**
1. Descarga desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante la instalación, recuerda la contraseña que pongas para el usuario `postgres`
4. Completa la instalación

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Mac
brew install postgresql
brew services start postgresql
```

---

### 2️⃣ CREAR LA BASE DE DATOS

Abre PostgreSQL (psql) y ejecuta:

```sql
-- Conectarse a PostgreSQL como superusuario
psql -U postgres

-- Crear la base de datos
CREATE DATABASE streamboost_db;

-- Verificar que se creó
\l

-- Salir
\q
```

O desde la línea de comandos:
```bash
createdb -U postgres streamboost_db
```

---

### 3️⃣ CONFIGURAR LAS VARIABLES DE ENTORNO

1. En la carpeta `backend/`, crea un archivo llamado `.env`
2. Copia el contenido del archivo `.env.example`
3. Edita los valores según tu configuración:

```env
DB_USER=postgres
DB_PASS=tu_password_de_postgresql
DB_NAME=streamboost_db
DB_HOST=localhost
```

**⚠️ IMPORTANTE:** 
- Reemplaza `tu_password_de_postgresql` con la contraseña que configuraste durante la instalación
- El archivo `.env` NO debe subirse a Git (ya está en .gitignore)

---

### 4️⃣ INSTALAR DEPENDENCIAS (si no lo has hecho)

```bash
cd backend
npm install
```

---

### 5️⃣ EJECUTAR LAS MIGRACIONES

Las migraciones crean automáticamente las tablas en la base de datos:

```bash
cd backend
npx sequelize-cli db:migrate
```

**Esto creará las siguientes tablas:**
- `users` (usuarios)
- `streams` (transmisiones)
- `donacions` (donaciones)

**Para verificar que funcionó:**
```bash
psql -U postgres -d streamboost_db
\dt
```

Deberías ver las 3 tablas listadas.

---

### 6️⃣ VERIFICAR QUE TODO FUNCIONA

Inicia el servidor:
```bash
cd backend
node server.js
```

Si ves:
```
Servidor escuchando en el puerto 3080
```

¡Todo está configurado correctamente! ✅

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Solución:**
- Verifica que PostgreSQL esté corriendo:
  - Windows: Servicios → Busca "postgresql" → Iniciar servicio
  - Linux: `sudo service postgresql start`
  - Mac: `brew services start postgresql`

### Error: "password authentication failed"

**Solución:**
- Verifica que la contraseña en el archivo `.env` sea correcta
- Intenta cambiar la contraseña en PostgreSQL:
  ```sql
  ALTER USER postgres WITH PASSWORD 'nueva_password';
  ```

### Error: "database does not exist"

**Solución:**
- Crea la base de datos manualmente:
  ```sql
  CREATE DATABASE streamboost_db;
  ```

### Error: "relation already exists"

**Solución:**
- Las tablas ya existen. Si quieres recrearlas:
  ```bash
  npx sequelize-cli db:migrate:undo:all
  npx sequelize-cli db:migrate
  ```

---

## 📊 ESTRUCTURA DE LA BASE DE DATOS

### Tabla: users
- `id` (PK, auto increment)
- `nombre` (STRING)
- `correo` (STRING)
- `password` (STRING)
- `tipoUsuario` (STRING)
- `saldo` (INTEGER)
- `createdAt` (DATE)
- `updatedAt` (DATE)

### Tabla: streams
- `id` (PK, auto increment)
- `titulo` (STRING)
- `descripcion` (STRING)
- `streamerId` (INTEGER, FK → users.id)
- `createdAt` (DATE)
- `updatedAt` (DATE)

### Tabla: donacions
- `id` (PK, auto increment)
- `userId` (INTEGER, FK → users.id)
- `streamerId` (INTEGER, FK → users.id)
- `streamId` (INTEGER, FK → streams.id)
- `monto` (INTEGER)
- `createdAt` (DATE)
- `updatedAt` (DATE)

---

## ✅ CHECKLIST FINAL

Antes de decir que está listo, verifica:

- [ ] PostgreSQL está instalado y corriendo
- [ ] Base de datos `streamboost_db` creada
- [ ] Archivo `.env` configurado con las credenciales correctas
- [ ] Dependencias instaladas (`npm install`)
- [ ] Migraciones ejecutadas (`npx sequelize-cli db:migrate`)
- [ ] Servidor inicia sin errores (`node server.js`)
- [ ] Las tablas existen en la base de datos

---

## 📞 SI NECESITAS AYUDA

Si algo no funciona:
1. Revisa los logs del servidor
2. Verifica la conexión a PostgreSQL: `psql -U postgres -d streamboost_db`
3. Revisa que el archivo `.env` tenga los valores correctos
4. Asegúrate de estar en la carpeta `backend` al ejecutar los comandos

¡Listo! Con estos pasos, la base de datos debería estar configurada y funcionando. 🚀

