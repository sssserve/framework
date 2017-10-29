const app = require('./app')

module.exports = function view(view) {
  return view ? app('view', view) : app('view.factory')
}
