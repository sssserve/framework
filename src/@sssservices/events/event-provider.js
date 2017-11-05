const Provider = require('@sssservices/support/provider')
const Dispatcher = require('@sssservices/events/dispatcher')

class EventProvider extends Provider {
  register() {
    this.app.singleton('events', app => {
      return new Dispatcher()
    })
  }
}

module.exports = EventProvider
