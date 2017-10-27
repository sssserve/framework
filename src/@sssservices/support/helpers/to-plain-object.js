const isContext = require('./is-context')

module.exports = function toPlainObject(src) {
  if (isContext(src)) {
    const obj = {}

    for (const key of src.keys()) {
      obj[key] = src(key)
    }

    return obj
  }

  return require('lodash/toPlainObject')
}
