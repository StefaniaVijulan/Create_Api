const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000; // default port

const server = http.createServer(app);

// its start the server
server.listen(port);