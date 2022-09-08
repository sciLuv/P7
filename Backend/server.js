//Package allowing to put environment variables outside the code itself.
import * as dotenv from 'dotenv';
dotenv.config();

//import of the http module of NODE JS which allows us to transfer information via this protocol.
import http from 'http';
//import of the api application
import app from './app.js';

//transforms a port written in string into a number
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//declaration of the port on which the server will run the backend
const port = normalizePort(process.env.PORT);
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//creation of server
const server = http.createServer(app);

//predict errors or successful listening to the server
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//the server listen if there are changement
server.listen(port);