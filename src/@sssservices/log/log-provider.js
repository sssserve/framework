const Provider = require('@sssservices/support/provider')
const logger = require('@sssservices/log/logger')

class LogProvider extends Provider {
  register() {
    this.app.instance('log', logger)
  }
}

module.exports = LogProvider
