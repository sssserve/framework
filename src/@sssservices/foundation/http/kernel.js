class Kernel {
  constructor(app) {
    this.app = app
    this.middleware = []
    this.middlewareGroups = {}
    this.routeMiddleware = {}

    this.bootstrappers = [
      require('../bootstrap/load-configuration'),
      require('../bootstrap/register-providers'),
      require('../bootstrap/boot-providers')
    ]
  }

  handle(request) {
    this.app.instance('request', request)

    this.bootstrap()
  }

  bootstrap() {
    if (!this.app.hasBeenBootstrapped) {
      this.app.bootstrapWith(this.bootstrappers)
    }
  }
}

module.exports = Kernel
