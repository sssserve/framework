const Facade = require('./facade')

class Config extends Facade {
  static getFacadeAccessor() {
    return 'config'
  }
}

module.exports = Config.facade()
