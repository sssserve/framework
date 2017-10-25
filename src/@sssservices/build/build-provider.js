const Provider = require('../support/provider')
const BuildManager = require('./build-manager')

class BuildProvider extends Provider {
  register() {
    this.registerCompilerServices()
  }

  registerCompilerServices() {
    this.app.singleton('build', app => {
      return new BuildManager(app)
    })

    this.app.bind('build.compiler', app => {
      return app.make('build').compiler()
    })
  }
}

module.exports = BuildProvider
