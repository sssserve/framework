const isCallable = require('./is-callable')

module.exports = function isContext(context) {
  return isCallable(context) && isCallable(context.keys)
}
