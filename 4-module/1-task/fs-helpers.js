const fs = require('fs');
const fsPromises = require('fs').promises;

async function access(path) {
  try {
    await fsPromises.access(path, fs.constants.F_OK | fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  access,
};
