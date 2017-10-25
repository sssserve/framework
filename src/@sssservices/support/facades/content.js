const Facade = require('./facade')

class Content extends Facade {
  static getFacadeAccessor() {
    return 'content'
  }
}

module.exports = Content.facade()
