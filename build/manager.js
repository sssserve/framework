const fs = require('fs')

class Manager {
  constructor(publisher) {
    this.publisher = publisher
  }

  write(name) {
    fs.writeFileSync(
      this.resolve(name, 'package.json'),
      JSON.stringify(this.config(name), null, '\t')
    )
  }

  require(...parameters) {
    return require(this.resolve(...parameters))
  }

  resolve(name, index) {
    index = index || ''

    if (!name) {
      return this.publisher.path(index)
    }

    return this.publisher.subpath(name, index)
  }

  config(name) {
    return this.require(name, 'package.json')
  }

  version(name) {
    return this.config(name).version
  }

  save(name) {
    if (!this.versioned(name)) {
      throw new Error(`Version control for [${name}] does not exist.`)
    }

    this.write(name)
  }

  versioned(name) {
    return fs.existsSync(this.resolve(name, '.git'))
  }
}

module.exports = Manager
