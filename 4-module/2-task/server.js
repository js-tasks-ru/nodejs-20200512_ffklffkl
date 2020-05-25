const url = require('url');
const http = require('http');
const {STATUS_CODES} = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const SIZE_LIMIT = 1024 * 1024;
const NOOP = () => undefined;

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/') || pathname.includes('..')) return sendResponse(400);
  if (req.headers['content-length'] > SIZE_LIMIT) return sendResponse(413);

  switch (req.method) {
    case 'POST':
      req
          .on('aborted', () => fs.unlink(filepath, NOOP))
          .on('error', (err) => handleError(err))
          .pipe(new LimitSizeStream({limit: SIZE_LIMIT}))
          .on('error', (err) => fs.unlink(filepath, () => handleError(err)))
          .pipe(fs.createWriteStream(filepath, {flags: 'wx'}))
          .on('error', (err) => handleError(err))
          .on('finish', () => sendResponse(201));
      break;
    default:
      sendResponse(501);
  }

  function handleError(err) {
    switch (err.code) {
      case 'EEXIST':
        sendResponse(409);
        break;
      case 'LIMIT_EXCEEDED':
        sendResponse(413);
        break;
      default:
        sendResponse(500);
    }
  }

  function sendResponse(code) {
    res.statusCode = code;
    res.end(STATUS_CODES[code]);
  }
});

module.exports = server;
