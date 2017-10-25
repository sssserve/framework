const get = require('../support/get')
const set = require('../support/set')
const has = require('../support/has')

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
