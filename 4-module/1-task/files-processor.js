const fs = require('fs');
const path = require('path');
const fsHelpers = require('./fs-helpers');
const constants = require('./constants');

async function getFile(pathSegments, res) {
  const filepath = path.join(constants.FILES_ROOT, ...pathSegments);

  if (pathSegments.length !== 1) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  if (await fsHelpers.access(filepath)) {
    res.statusCode = 200;
    fs.createReadStream(filepath).pipe(res);
    return;
  }

  res.statusCode = 404;
  res.end('File Not Found');
}

module.exports = {
  getFile,
};
