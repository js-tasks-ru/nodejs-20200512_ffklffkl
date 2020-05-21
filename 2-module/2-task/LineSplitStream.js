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
      const lines = this.data.split(os.EOL);
      this.data = lines.pop();
      for (const line of lines) this.push(line);
    }

    callback();
  }

  _flush(callback) {
    this.data && callback(null, this.data);
  }
}

module.exports = LineSplitStream;
