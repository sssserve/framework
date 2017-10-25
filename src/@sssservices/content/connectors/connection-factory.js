const CollectionConnector = require('./collection-connector')
const ucFirst = require('../../support/helpers/uc-first')

class CollectionFactory {
  constructor(container) {
    this.container = container
  }

  make(config, name) {
    const driver = config.driver

    if (this.container.bound(driver)) {
      return this.container.make(driver, config)
    }

    const resolver = this[`make${ucFirst(driver)}Connector`]

    if (!resolver) {
      throw new Error(`Connector [${driver}] for [${name}] does not exist.`)
    }

    return resolver(config)
  }

  makeCollectionConnector(config) {
    const connector = new CollectionConnector(config)

    return connector.collect()
  }
}

module.exports = CollectionFactory
