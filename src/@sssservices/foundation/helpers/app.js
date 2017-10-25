const Application = require('../application')

module.exports = function app(binding, ...parameters) {
  if (binding) {
    return Application.getInstance().makeWith(binding, parameters)
  }

  return Application.getInstance()
}
