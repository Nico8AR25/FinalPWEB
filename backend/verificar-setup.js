// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// console.log('═══════════════════════════════════════════════');
// console.log('  VERIFICACIÓN DE SETUP - STREAMBOOST');
// console.log('═══════════════════════════════════════════════\n');

// let errores = [];
// let exitos = [];

// function verificarArchivo(ruta, nombre) {
//   if (fs.existsSync(ruta)) {
//     exitos.push(`✓ ${nombre} existe`);
//     return true;
//   } else {
//     errores.push(`✗ ${nombre} NO existe en: ${ruta}`);
//     return false;
//   }
// }

// function verificarServidor() {
//   return new Promise((resolve) => {
//     const req = http.request({
//       hostname: 'localhost',
//       port: 3080,
//       path: '/',
//       method: 'GET',
//       timeout: 2000
//     }, (res) => {
//       exitos.push('✓ Servidor respondiendo en puerto 3080');
//       resolve(true);
//     });

//     req.on('error', () => {
//       errores.push('✗ Servidor NO está corriendo en puerto 3080');
//       errores.push('  → Ejecuta: node server.js');
//       resolve(false);
//     });

//     req.on('timeout', () => {
//       req.destroy();
//       errores.push('✗ Servidor NO responde (timeout)');
//       resolve(false);
//     });

//     req.end();
//   });
// }

// async function verificarTodo() {
//   console.log('1. Verificando archivos...\n');

//   const backendPath = __dirname;

//   verificarArchivo(path.join(backendPath, '.env'), 'Archivo .env');
//   verificarArchivo(path.join(backendPath, 'server.js'), 'server.js');
//   verificarArchivo(path.join(backendPath, 'package.json'), 'package.json');
//   verificarArchivo(path.join(backendPath, 'api', 'users.js'), 'api/users.js');
//   verificarArchivo(path.join(backendPath, 'api', 'streams.js'), 'api/streams.js');
//   verificarArchivo(path.join(backendPath, 'api', 'donaciones.js'), 'api/donaciones.js');
//   verificarArchivo(path.join(backendPath, 'db', 'models', 'index.js'), 'db/models/index.js');
//   verificarArchivo(path.join(backendPath, 'db', 'migrations', '20241116000001-create-user.js'), 'Migración users');
//   verificarArchivo(path.join(backendPath, 'db', 'migrations', '20241116000002-create-stream.js'), 'Migración streams');
//   verificarArchivo(path.join(backendPath, 'db', 'migrations', '20241116000003-create-donacion.js'), 'Migración donaciones');

//   console.log('2. Verificando configuración .env...\n');

//   if (fs.existsSync(path.join(backendPath, '.env'))) {
//     const envContent = fs.readFileSync(path.join(backendPath, '.env'), 'utf8');
//     if (envContent.includes('DB_USER=') && envContent.includes('DB_PASS=')) {
//       exitos.push('✓ Archivo .env tiene las variables necesarias');
//     } else {
//       errores.push('✗ Archivo .env incompleto');
//       errores.push('  → Debe contener: DB_USER, DB_PASS, DB_NAME, DB_HOST');
//     }
//   }

//   console.log('3. Verificando servidor...\n');

//   await verificarServidor();

//   console.log('\n═══════════════════════════════════════════════');
//   console.log('  RESULTADOS');
//   console.log('═══════════════════════════════════════════════\n');

//   if (exitos.length > 0) {
//     console.log('✅ EXITOS:');
//     exitos.forEach(msg => console.log('  ' + msg));
//     console.log('');
//   }

//   if (errores.length > 0) {
//     console.log('❌ ERRORES:');
//     errores.forEach(msg => console.log('  ' + msg));
//     console.log('');
//     console.log('📖 Revisa el archivo: CONFIGURACION_BASE_DATOS.md');
//   } else {
//     console.log('🎉 ¡Todo está configurado correctamente!');
//     console.log('\n💡 Para probar las APIs, ejecuta:');
//     console.log('   node test-completo.js');
//   }

//   console.log('');
// }

// verificarTodo();
