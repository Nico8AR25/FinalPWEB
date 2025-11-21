const http = require('http');

function hacerPeticion(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const opciones = {
      hostname: 'localhost',
      port: 3080,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(opciones, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        let jsonBody;
        try {
          jsonBody = body ? JSON.parse(body) : null;
        } catch (e) {
          jsonBody = body;
        }
        resolve({ status: res.statusCode, body: jsonBody || body });
      });
    });

    req.on('error', (error) => {
      reject({ error: error.message, code: error.code });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject({ error: 'Timeout', code: 'ETIMEDOUT' });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function probarTodo() {
  console.log('═══════════════════════════════════════════════');
  console.log('  PRUEBA COMPLETA DE APIS - STREAMBOOST');
  console.log('═══════════════════════════════════════════════\n');

  let userId = null;
  let streamId = null;
  let donacionId = null;

  try {
    console.log('1️⃣  POST /users/registro - Crear usuario');
    console.log('─────────────────────────────────────────────');
    const usuario = await hacerPeticion('POST', '/users/registro', {
      nombre: 'Test Usuario',
      correo: 'test@streamboost.com',
      password: '123456',
      tipoUsuario: 'streamer',
      saldo: 200
    });
    console.log(`   Estado: ${usuario.status}`);
    if (usuario.status === 200 && usuario.body && usuario.body.id) {
      userId = usuario.body.id;
      console.log(`   ✓ Usuario creado: ${usuario.body.nombre}`);
      console.log(`   ✓ ID: ${userId}`);
      console.log(`   ✓ Correo: ${usuario.body.correo}`);
      console.log(`   ✓ Saldo inicial: ${usuario.body.saldo}`);
    } else {
      console.log(`   ✗ Error: ${JSON.stringify(usuario.body)}`);
    }
    console.log('');

    if (userId) {
      console.log('2️⃣  POST /users/login - Login');
      console.log('─────────────────────────────────────────────');
      const login = await hacerPeticion('POST', '/users/login', {
        correo: 'test@streamboost.com',
        password: '123456'
      });
      console.log(`   Estado: ${login.status}`);
      if (login.status === 200 && login.body) {
        console.log(`   ✓ Login exitoso: ${login.body.nombre}`);
      } else {
        console.log(`   ✗ Error: ${JSON.stringify(login.body)}`);
      }
      console.log('');

      console.log('3️⃣  GET /users/:id - Obtener usuario');
      console.log('─────────────────────────────────────────────');
      const usuarioGet = await hacerPeticion('GET', `/users/${userId}`);
      console.log(`   Estado: ${usuarioGet.status}`);
      if (usuarioGet.status === 200 && usuarioGet.body) {
        console.log(`   ✓ Usuario obtenido: ${usuarioGet.body.nombre}`);
        console.log(`   ✓ Saldo actual: ${usuarioGet.body.saldo}`);
      } else {
        console.log(`   ✗ Error: ${JSON.stringify(usuarioGet.body)}`);
      }
      console.log('');

      console.log('4️⃣  PUT /users/recarga - Recargar saldo');
      console.log('─────────────────────────────────────────────');
      const recarga = await hacerPeticion('PUT', '/users/recarga', {
        userId: userId,
        monto: 50
      });
      console.log(`   Estado: ${recarga.status}`);
      if (recarga.status === 200 && recarga.body) {
        console.log(`   ✓ Recarga exitosa`);
        console.log(`   ✓ Nuevo saldo: ${recarga.body.saldo}`);
      } else {
        console.log(`   ✗ Error: ${JSON.stringify(recarga.body)}`);
      }
      console.log('');

      console.log('5️⃣  POST /streams/ - Crear stream');
      console.log('─────────────────────────────────────────────');
      const stream = await hacerPeticion('POST', '/streams/', {
        titulo: 'Stream de Prueba',
        descripcion: 'Este es un stream de prueba para las APIs',
        streamerId: userId
      });
      console.log(`   Estado: ${stream.status}`);
      if (stream.status === 200 && stream.body && stream.body.id) {
        streamId = stream.body.id;
        console.log(`   ✓ Stream creado: ${stream.body.titulo}`);
        console.log(`   ✓ ID: ${streamId}`);
        console.log(`   ✓ Streamer ID: ${stream.body.streamerId}`);
      } else {
        console.log(`   ✗ Error: ${JSON.stringify(stream.body)}`);
      }
      console.log('');

      console.log('6️⃣  GET /streams/ - Listar todos los streams');
      console.log('─────────────────────────────────────────────');
      const streams = await hacerPeticion('GET', '/streams/');
      console.log(`   Estado: ${streams.status}`);
      if (streams.status === 200 && Array.isArray(streams.body)) {
        console.log(`   ✓ Total streams: ${streams.body.length}`);
        if (streams.body.length > 0) {
          console.log(`   ✓ Primer stream: ${streams.body[0].titulo}`);
          if (streams.body[0].streamer) {
            console.log(`   ✓ Streamer asociado: ${streams.body[0].streamer.nombre}`);
          }
        }
      } else {
        console.log(`   ✗ Error: ${JSON.stringify(streams.body)}`);
      }
      console.log('');

      if (streamId) {
        console.log('7️⃣  GET /streams/:id - Obtener stream con detalles');
        console.log('─────────────────────────────────────────────');
        const streamDetalle = await hacerPeticion('GET', `/streams/${streamId}`);
        console.log(`   Estado: ${streamDetalle.status}`);
        if (streamDetalle.status === 200 && streamDetalle.body) {
          console.log(`   ✓ Stream: ${streamDetalle.body.titulo}`);
          if (streamDetalle.body.streamer) {
            console.log(`   ✓ Streamer: ${streamDetalle.body.streamer.nombre}`);
          }
          if (Array.isArray(streamDetalle.body.donaciones)) {
            console.log(`   ✓ Donaciones: ${streamDetalle.body.donaciones.length}`);
          }
        } else {
          console.log(`   ✗ Error: ${JSON.stringify(streamDetalle.body)}`);
        }
        console.log('');

        console.log('8️⃣  POST /donaciones/ - Crear donación');
        console.log('─────────────────────────────────────────────');
        const donacion = await hacerPeticion('POST', '/donaciones/', {
          userId: userId,
          streamerId: userId,
          streamId: streamId,
          monto: 25
        });
        console.log(`   Estado: ${donacion.status}`);
        if (donacion.status === 200 && donacion.body && donacion.body.id) {
          donacionId = donacion.body.id;
          console.log(`   ✓ Donación creada: ${donacion.body.monto} monedas`);
          console.log(`   ✓ ID: ${donacionId}`);
        } else {
          console.log(`   ✗ Error: ${JSON.stringify(donacion.body)}`);
        }
        console.log('');

        console.log('9️⃣  GET /donaciones/streamer/:id - Donaciones del streamer');
        console.log('─────────────────────────────────────────────');
        const donacionesStreamer = await hacerPeticion('GET', `/donaciones/streamer/${userId}`);
        console.log(`   Estado: ${donacionesStreamer.status}`);
        if (donacionesStreamer.status === 200 && Array.isArray(donacionesStreamer.body)) {
          console.log(`   ✓ Total donaciones recibidas: ${donacionesStreamer.body.length}`);
          if (donacionesStreamer.body.length > 0) {
            console.log(`   ✓ Monto total: ${donacionesStreamer.body.reduce((sum, d) => sum + (d.monto || 0), 0)} monedas`);
          }
        } else {
          console.log(`   ✗ Error: ${JSON.stringify(donacionesStreamer.body)}`);
        }
        console.log('');

        console.log('🔟 GET /donaciones/stream/:id - Donaciones del stream');
        console.log('─────────────────────────────────────────────');
        const donacionesStream = await hacerPeticion('GET', `/donaciones/stream/${streamId}`);
        console.log(`   Estado: ${donacionesStream.status}`);
        if (donacionesStream.status === 200 && Array.isArray(donacionesStream.body)) {
          console.log(`   ✓ Total donaciones del stream: ${donacionesStream.body.length}`);
          if (donacionesStream.body.length > 0) {
            console.log(`   ✓ Monto total: ${donacionesStream.body.reduce((sum, d) => sum + (d.monto || 0), 0)} monedas`);
          }
        } else {
          console.log(`   ✗ Error: ${JSON.stringify(donacionesStream.body)}`);
        }
        console.log('');
      }
    }

    console.log('═══════════════════════════════════════════════');
    console.log('  PRUEBAS COMPLETADAS');
    console.log('═══════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error en las pruebas:');
    if (error.error) {
      console.error(`   Error: ${error.error}`);
      console.error(`   Código: ${error.code}`);
    } else if (error.message) {
      console.error(`   Error: ${error.message}`);
    } else {
      console.error(`   Error: ${JSON.stringify(error)}`);
    }
    console.error('\n💡 Verifica que el servidor esté corriendo en http://localhost:3080');
  }
}

probarTodo();

