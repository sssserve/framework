const Provider = require('../support/provider')
const logger = require('./logger')

class LogProvider extends Provider {
  register() {
    this.app.instance('log', logger)
  }
}

module.exports = LogProvider
