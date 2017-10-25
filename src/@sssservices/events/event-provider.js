const Provider = require('../support/provider')
const Dispatcher = require('./dispatcher')

class EventProvider extends Provider {
  register() {
    this.app.singleton('events', app => {
      return new Dispatcher()
    })
  }
}

module.exports = EventProvider
