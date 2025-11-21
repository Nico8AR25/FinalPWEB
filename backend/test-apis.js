const http = require('http');

const testAPI = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3080,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: body });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function probarAPIs() {
  console.log('=== Probando APIs ===\n');

  try {
    console.log('1. POST /users/registro - Crear usuario');
    const usuario1 = await testAPI('POST', '/users/registro', {
      nombre: 'Juan Perez',
      correo: 'juan@test.com',
      password: '123456',
      tipoUsuario: 'streamer',
      saldo: 100
    });
    console.log(`   Estado: ${usuario1.status}`);
    const nuevoUsuario = JSON.parse(usuario1.body);
    console.log(`   Usuario creado: ${nuevoUsuario.nombre} (ID: ${nuevoUsuario.id})`);
    console.log('');

    console.log('2. POST /users/login - Login');
    const login = await testAPI('POST', '/users/login', {
      correo: 'juan@test.com',
      password: '123456'
    });
    console.log(`   Estado: ${login.status}`);
    if (login.status === 200) {
      const usuarioLogin = JSON.parse(login.body);
      console.log(`   Login exitoso: ${usuarioLogin.nombre}`);
    } else {
      console.log(`   Error: ${login.body}`);
    }
    console.log('');

    console.log('3. GET /users/:id - Obtener usuario');
    const usuario = await testAPI('GET', `/users/${nuevoUsuario.id}`);
    console.log(`   Estado: ${usuario.status}`);
    const usuarioGet = JSON.parse(usuario.body);
    console.log(`   Usuario obtenido: ${usuarioGet.nombre}`);
    console.log('');

    console.log('4. PUT /users/recarga - Recargar saldo');
    const recarga = await testAPI('PUT', '/users/recarga', {
      userId: nuevoUsuario.id,
      monto: 50
    });
    console.log(`   Estado: ${recarga.status}`);
    const usuarioRecargado = JSON.parse(recarga.body);
    console.log(`   Saldo actualizado: ${usuarioRecargado.saldo}`);
    console.log('');

    console.log('5. POST /streams/ - Crear stream');
    const stream = await testAPI('POST', '/streams/', {
      titulo: 'Mi primer stream',
      descripcion: 'Stream de prueba',
      streamerId: nuevoUsuario.id
    });
    console.log(`   Estado: ${stream.status}`);
    const nuevoStream = JSON.parse(stream.body);
    console.log(`   Stream creado: ${nuevoStream.titulo} (ID: ${nuevoStream.id})`);
    console.log('');

    console.log('6. GET /streams/ - Listar streams');
    const streams = await testAPI('GET', '/streams/');
    console.log(`   Estado: ${streams.status}`);
    const listaStreams = JSON.parse(streams.body);
    console.log(`   Total streams: ${listaStreams.length}`);
    console.log('');

    console.log('7. GET /streams/:id - Obtener stream con detalles');
    const streamDetalle = await testAPI('GET', `/streams/${nuevoStream.id}`);
    console.log(`   Estado: ${streamDetalle.status}`);
    const streamCompleto = JSON.parse(streamDetalle.body);
    console.log(`   Stream: ${streamCompleto.titulo}`);
    console.log('');

    console.log('8. POST /donaciones/ - Crear donación');
    const donacion = await testAPI('POST', '/donaciones/', {
      userId: nuevoUsuario.id,
      streamerId: nuevoUsuario.id,
      streamId: nuevoStream.id,
      monto: 25
    });
    console.log(`   Estado: ${donacion.status}`);
    const nuevaDonacion = JSON.parse(donacion.body);
    console.log(`   Donación creada: ${nuevaDonacion.monto} monedas`);
    console.log('');

    console.log('9. GET /donaciones/streamer/:id - Donaciones del streamer');
    const donacionesStreamer = await testAPI('GET', `/donaciones/streamer/${nuevoUsuario.id}`);
    console.log(`   Estado: ${donacionesStreamer.status}`);
    const listaDonaciones = JSON.parse(donacionesStreamer.body);
    console.log(`   Total donaciones recibidas: ${listaDonaciones.length}`);
    console.log('');

    console.log('10. GET /donaciones/stream/:id - Donaciones del stream');
    const donacionesStream = await testAPI('GET', `/donaciones/stream/${nuevoStream.id}`);
    console.log(`   Estado: ${donacionesStream.status}`);
    const donacionesDelStream = JSON.parse(donacionesStream.body);
    console.log(`   Total donaciones del stream: ${donacionesDelStream.length}`);
    console.log('');

    console.log('=== Todas las pruebas completadas ===');

  } catch (error) {
    console.error('Error en las pruebas:', error.message);
  }
}

probarAPIs();

