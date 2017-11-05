const get = require('@sssservices/support/helpers/get')
const set = require('@sssservices/support/helpers/set')
const has = require('@sssservices/support/helpers/has')

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
