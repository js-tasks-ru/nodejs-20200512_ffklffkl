const url = require('url');
const http = require('http');
const filesProcessor = require('./files-processor');

const server = new http.Server();

server.on('request', async (req, res) => {
  try {
    const pathSegments = url.parse(req.url).pathname.slice(1).split('/');

    switch (req.method) {
      case 'GET':
        await filesProcessor.getFile(pathSegments, res);
        break;
      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Error');
  }
});

server.on('error', (err) => console.error(err));

module.exports = server;
