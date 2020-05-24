const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  switch (req.method) {
    case 'POST':
      const limitSize = new LimitSizeStream({limit: 1024 * 1024});
      const writeFile = fs.createWriteStream(filepath, {flags: 'wx'});

      limitSize.on('error', (err) => {
        fs.unlink(filepath, () => {});
        errorHandler(err);
      });

      writeFile
          .on('error', (err) => errorHandler(err));

      req
          .on('aborted', () => fs.unlink(filepath, () => {}))
          .on('error', (err) => errorHandler(err))
          .pipe(limitSize)
          .pipe(writeFile)
          .on('finish', () => {
            res.statusCode = 201;
            res.end('Success');
          });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  function errorHandler(err) {
    switch (err.code) {
      case 'EEXIST': {
        res.statusCode = 409;
        res.end('Conflict');
        break;
      }
      case 'LIMIT_EXCEEDED': {
        res.statusCode = 413;
        res.end('Limit exceeded');
        break;
      }
      default: {
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }
  }
});

module.exports = server;
