const Provider = require('../support/provider')

class LogProvider extends Provider {
  register() {
    this.app.instance('log', console)
  }
}

module.exports = LogProvider
