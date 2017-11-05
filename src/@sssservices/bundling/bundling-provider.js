const Provider = require('../support/provider')
const BundleManager = require('./bundle-manager')

class BundlingProvider extends Provider {
  register() {
    this.registerCompilerServices()
  }

  registerCompilerServices() {
    this.app.singleton('bundle', app => {
      return new BundleManager(app)
    })

    this.app.bind('build.compiler', app => {
      return app.make('build').compiler()
    })
  }
}

module.exports = BundlingProvider
