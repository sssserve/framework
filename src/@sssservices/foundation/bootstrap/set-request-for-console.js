const Request = require('../../http/request')

class SetRequestForConsole {
  bootstrap(app) {
    const uri = app.make('config').get('app.url', 'http://localhost')

    const request = Request.create(uri, 'GET')

    app.instance('request', request)
  }
}

module.exports = SetRequestForConsole
