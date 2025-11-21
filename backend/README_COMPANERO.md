# 👋 HOLA COMPAÑERO - INSTRUCCIONES PARA CONFIGURAR LA BASE DE DATOS

## 🎯 TU TAREA

Solo necesitas configurar PostgreSQL y ejecutar las migraciones. **Todo lo demás ya está listo.**

---

## ⚡ INICIO RÁPIDO (5 pasos)

### Paso 1: Crear archivo `.env`

En la carpeta `backend/`, crea un archivo llamado `.env` con esto:

```env
DB_USER=postgres
DB_PASS=tu_password_de_postgres
DB_NAME=streamboost_db
DB_HOST=localhost
```

**Cambia** `tu_password_de_postgres` por tu contraseña real de PostgreSQL.

---

### Paso 2: Crear la base de datos

Ejecuta en psql o pgAdmin:

```sql
CREATE DATABASE streamboost_db;
```

O desde la terminal:
```bash
createdb -U postgres streamboost_db
```

---

### Paso 3: Instalar dependencias (si no están)

```bash
cd backend
npm install
```

---

### Paso 4: Ejecutar migraciones

```bash
npx sequelize-cli db:migrate
```

Esto crea las 3 tablas automáticamente:
- ✅ users
- ✅ streams  
- ✅ donacions

---

### Paso 5: Verificar que funciona

```bash
node server.js
```

Si ves `Servidor escuchando en el puerto 3080` → **¡LISTO!** ✅

O ejecuta la verificación automática:
```bash
node verificar-setup.js
```

---

## 📚 DOCUMENTACIÓN COMPLETA

Si necesitas más detalles, lee:
- `SETUP_BASE_DATOS.md` - Guía rápida
- `CONFIGURACION_BASE_DATOS.md` - Guía completa con solución de problemas

---

## ✅ LO QUE YA ESTÁ LISTO

- ✅ Servidor Express configurado
- ✅ Todas las APIs creadas y funcionando
- ✅ Modelos de Sequelize definidos
- ✅ Asociaciones entre modelos configuradas
- ✅ Migraciones listas para ejecutar
- ✅ Rutas conectadas en server.js

**Solo falta:** PostgreSQL configurado y migraciones ejecutadas.

---

## 🆘 SI ALGO NO FUNCIONA

1. Verifica que PostgreSQL esté corriendo
2. Revisa que el archivo `.env` tenga los valores correctos
3. Ejecuta `node verificar-setup.js` para diagnóstico
4. Lee `CONFIGURACION_BASE_DATOS.md` para soluciones

---

## 📝 NOTAS IMPORTANTES

- El archivo `.env` NO debe subirse a Git
- Si cambias algo en los modelos, crea una nueva migración
- Las APIs ya están probadas y funcionando (solo falta la BD)

¡Mucha suerte! 🚀

