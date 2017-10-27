const get = require('../support/helpers/get')
const set = require('../support/helpers/set')
const has = require('../support/helpers/has')

class Repository {
  constructor(items) {
    this.items = items || {}
  }

  has(key) {
    return has(this.items, key)
  }

  get(key, fallback) {
    return get(this.items, key) || fallback
  }

  set(key, value) {
    return set(this.items, key, value)
  }

  all() {
    return this.items
  }
}

module.exports = Repository
