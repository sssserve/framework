const BaseCollection = require('../../support/collection')
const isCallable = require('../../support/helpers/is-callable')
const isArray = require('../../support/helpers/is-array')

class Collection extends BaseCollection {
  add(item) {
    this.items.push(item)

    return this
  }

  find(key, fallback) {
    if (isCallable(key.getKey)) {
      key = key.getKey()
    }

    if (isArray(key)) {
      if (this.isEmpty()) {
        return new this.constructor()
      }

      return this.whereIn(this.first().getKeyName(), key)
    }

    const models = this.all()

    for (const model of models) {
      if (isCallable(model.getKey) && model.getKey() === key) {
        return model
      }

      if (model === key) {
        return model
      }
    }
  }

  from(table) {
    return new this.constructor(this.items[table])
  }

  setModel(model) {
    return this.from(model.getTable()).mapInto(model.constructor)
  }

  static get methods() {
    return Object.keys(BaseCollection.prototype).concat(
      Object.getOwnPropertyNames(this.prototype).splice(1)
    )
  }
}

module.exports = Collection
