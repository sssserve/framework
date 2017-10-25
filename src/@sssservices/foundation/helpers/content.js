const app = require('./app')

module.exports = function content(connection) {
  return connection ? app('content').connection(connection) : app('content')
}
