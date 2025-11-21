# 🚀 SETUP RÁPIDO - BASE DE DATOS

## ⚡ PASOS RÁPIDOS (5 minutos)

### 1. Crear archivo `.env` en la carpeta `backend/`

Crea un archivo llamado `.env` con este contenido:

```env
DB_USER=postgres
DB_PASS=tu_password_aqui
DB_NAME=streamboost_db
DB_HOST=localhost
```

**Importante:** Reemplaza `tu_password_aqui` con la contraseña de tu PostgreSQL.

---

### 2. Crear la base de datos en PostgreSQL

Abre psql o pgAdmin y ejecuta:

```sql
CREATE DATABASE streamboost_db;
```

O desde la terminal:
```bash
createdb -U postgres streamboost_db
```

---

### 3. Instalar dependencias (si no lo has hecho)

```bash
cd backend
npm install
```

---

### 4. Ejecutar migraciones

```bash
npx sequelize-cli db:migrate
```

---

### 5. Iniciar el servidor

```bash
node server.js
```

Si ves `Servidor escuchando en el puerto 3080` → ✅ **¡Listo!**

---

## ❓ ¿Problemas?

Lee el archivo completo: `CONFIGURACION_BASE_DATOS.md`

---

## 📋 CHECKLIST

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `streamboost_db` creada
- [ ] Archivo `.env` creado con las credenciales
- [ ] Migraciones ejecutadas
- [ ] Servidor inicia correctamente

¡Eso es todo! 🎉

