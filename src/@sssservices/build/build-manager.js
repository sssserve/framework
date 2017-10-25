class BuildManager {
  constructor(app) {
    this.app = app
    this.compilers = {}
    this.extensions = {}

    return new Proxy(this, {
      get(target, key) {
        return key in target ? target[key] : target.compiler()[key]
      }
    })
  }

  compiler(name) {
    if (!this.compilers[name]) {
      this.compilers[name] = this.makeCompiler(name)
    }

    return this.compilers[name]
  }

  makeCompiler(name) {
    const config = this.configuration(name)

    if (this.extensions[name]) {
      return this.extensions[name](config, name)
    }

    const driver = config['driver']

    if (!this.extensions[driver]) {
      throw new Error(`Compiler [${driver}] for [${name}] does not exist.`)
    }

    return this.extensions[driver](config, name)
  }

  configuration(name) {
    name = name || this.getDefaultCompiler()

    const compilers = this.app.make('config').get('build.compilers')

    const config = compilers[name]

    if (!config) {
      throw new Error(`Build [${name}] not configured.`)
    }

    return config
  }

  getDefaultCompiler() {
    return this.app.make('config').get('build.default')
  }

  setDefaultCompiler(name) {
    this.app.make('config').set('build.default', name)
  }

  extend(name, resolver) {
    this.extensions[name] = resolver
  }
}

module.exports = BuildManager
