class ContentManager {
  constructor(app, factory) {
    this.app = app
    this.factory = factory
    this.connections = {}
    this.extensions = {}

    return new Proxy(this, {
      get(target, key) {
        return key in target ? target[key] : target.connection()[key]
      }
    })
  }

  connection(name) {
    if (!this.connections[name]) {
      this.connections[name] = this.makeConnection(name)
    }

    return this.connections[name]
  }

  makeConnection(name) {
    const config = this.configuration(name)

    if (this.extensions[name]) {
      return this.extensions[name](config, name)
    }

    const driver = config['driver']

    if (this.extensions[driver]) {
      return this.extensions[driver](config, name)
    }

    return this.factory.make(config, name)
  }

  configuration(name) {
    name = name || this.getDefaultConnection()

    const connections = this.app.make('config').get('content.connections')

    const config = connections[name]

    if (!config) {
      // throw new InvalidArgumentException("Database [name] not configured.");
      throw new Error(`Content [${name}] not configured.`)
    }

    return config
  }

  getDefaultConnection() {
    return this.app.make('config').get('content.default')
  }

  setDefaultConnection(name) {
    this.app.make('config').set('content.default', name)
  }

  extend(name, resolver) {
    this.extensions[name] = resolver
  }

  // public function __call(method, parameters)
  // {
  //     return this.connection().method(...parameters);
  // }
}

module.exports = ContentManager
