const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, _, callback) {
    this.data += chunk;
    if (~this.data.indexOf(os.EOL)) {
      const [consumed, current] = this.data.split(os.EOL);
      this.data = current;
      callback(null, consumed);
    } else {
      callback();
    }
  }

  _flush(callback) {
    callback(null, this.data);
  }
}

module.exports = LineSplitStream;
