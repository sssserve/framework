const fs = require('fs')
const posix = require('path').posix

class Filesystem {
  constructor(config) {
    this.config = config
  }

  resolve(path) {
    return posix.resolve(this.config.root, path)
  }

  exists(path, callback) {
    path = this.resolve(path)

    if (callback) {
      return fs.exists(path, callback)
    }

    return fs.existsSync(path)
  }
}

module.exports = Filesystem
