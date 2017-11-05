const Finder = require('fs-finder')
const Repository = require('../../config/repository')
const path = require('path')
const fs = require('fs')

class LoadConfiguration {
  bootstrap(app) {
    let items = {}
    let cached = app.getCachedConfigPath()
    let loadedFromCache = false

    if (fs.existsSync(cached)) {
      items = require(cached)
      loadedFromCache = true
    }

    const config = new Repository(items)

    app.instance('config', config)

    if (!loadedFromCache) {
      this.loadConfigurationFiles(app, config)
    }

    app.detectEnvironment(function() {
      return config.get('app.env', 'production')
    })

    process.env.TZ = config.get('app.timezone', 'UTC')
  }

  loadConfigurationFiles(app, repository) {
    const files = this.getConfigurationFiles(app)

    if (!files['app']) {
      throw new Error('Unable to load the "app" configuration file.')
    }

    for (const key in files) {
      repository.set(key, files[key])
    }
  }

  getConfigurationFiles(app) {
    const files = {}
    const configPath = app.configPath()

    for (const file of Finder.from(configPath).findFiles('*.js')) {
      const relative = path.posix
        .relative(configPath, file)
        .replace(/\.js$/, '')

      files[relative.split(path.sep).join('.')] = require(file)
    }

    return files
  }
}

module.exports = LoadConfiguration
