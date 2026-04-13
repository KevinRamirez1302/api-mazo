const http = require('http');

const data = JSON.stringify({
  nombre: "Kevin",
  apellido: "Ramirez",
  email: "k.antigravity.test@gmail.com",
  curso: "Desarrollo Fullstack",
  mensaje: "Prueba de envío de correo desde Antigravity"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/personas',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Response Body:', body);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
