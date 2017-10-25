const Model = require('./orm/model')
const Provider = require('../support/provider')
const ContentManager = require('./content-manager')
const ConnectionFactory = require('./connectors/connection-factory')

class ContentProvider extends Provider {
  boot() {
    Model.setConnectionResolver(this.app.make('content'))
  }

  register() {
    this.registerConnectionServices()

    // this.registerEloquentFactory()

    // this.registerQueueableEntityResolver()
  }

  registerConnectionServices() {
    this.app.singleton('content.factory', app => {
      return new ConnectionFactory(app)
    })

    this.app.singleton('content', app => {
      return new ContentManager(app, app.make('content.factory'))
    })

    this.app.bind('content.connection', app => {
      return app.make('content').connection()
    })
  }
}

module.exports = ContentProvider
