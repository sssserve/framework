const Repository = require('../../config/repository')
const isCallable = require('../../support/helpers/is-callable')

class LoadConfiguration {
  bootstrap(app) {
    const config = new Repository()

    app.instance('config', config)

    if (app.bound('config.context')) {
      this.loadConfiguration(app)
    }
  }

  loadConfiguration(app) {
    let config = app.make('config')

    let context = app.make('config.context')

    if (isCallable(context.keys)) {
      context = this.getConfigurationFromContext(context)
    }

    config.items = context
  }

  getConfigurationFromContext(context) {
    const config = {}

    for (const key of context.keys()) {
      config[key.replace(/\//g, '.')] = context(key)
    }

    return config
  }
}

module.exports = LoadConfiguration
