const Collection = require('./collection')
const belongsTo = require('./relations/belongs-to')
const hasMany = require('./relations/has-many')
const plural = require('../../support/helpers/plural')
const slug = require('../../support/helpers/slug')

class Model {
  constructor(attributes) {
    this.primaryKey = 'id'

    this.fill(attributes || {})
  }

  fill(attributes) {
    if (!this.attributes) {
      this.attributes = attributes
    }

    for (const attribute in attributes) {
      let description =
        Object.getOwnPropertyDescriptor(
          this.constructor.prototype,
          attribute
        ) || {}

      delete this[attribute]

      Object.defineProperty(this, attribute, {
        enumerable: false,
        configurable: false,
        get:
          description.get ||
          function() {
            return this.attributes[attribute]
          },
        set:
          description.set ||
          function(value) {
            this.attributes[attribute] = value
          }
      })
    }

    return this
  }

  newInstance(attributes, exists) {
    const model = new this.constructor(attributes)

    model.exists = exists

    model.setConnection(this.connection)

    return model
  }

  save() {
    // if (!this.constructor.query().find(this)) {
    //   this.constructor.query().add(this.attributes)
    // }
  }

  static query() {
    return new this().newQuery()
  }

  newQuery() {
    return this.getConnection().setModel(this)
  }

  is(model) {
    return (
      this.getKey() === model.getKey() &&
      this.getTable() === model.getTable() &&
      this.connection === model.connection
    )
  }

  getConnection() {
    return this.constructor.resolveConnection(this.connection)
  }

  setConnection(name) {
    this.connection = name

    return this
  }

  static resolveConnection(connection) {
    return this.resolver.connection(connection)
  }

  static setConnectionResolver(resolver) {
    this.resolver = resolver
  }

  getTable() {
    if (!this.table) {
      this.table = plural(slug(this.constructor.name))
    }

    return this.table
  }

  getKeyName() {
    return this.primaryKey
  }

  getKey() {
    return this.getAttribute(this.getKeyName())
  }

  getRouteKey() {
    return this.getAttribute(this.getRouteKeyName())
  }

  getRouteKeyName() {
    return this.getKeyName()
  }

  getForeignKey() {
    return slug(this.constructor.name) + '_' + this.primaryKey
  }

  getAttribute(key) {
    return this.attributes[key]
  }
}

Model.prototype.belongsTo = belongsTo
Model.prototype.hasMany = hasMany

for (const method of Collection.methods) {
  if (!Model[method]) {
    Model[method] = function(...params) {
      return this.query()[method](...params)
    }
  }
}

module.exports = Model
