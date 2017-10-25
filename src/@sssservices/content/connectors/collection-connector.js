const Collection = require('../orm/collection')
const isCallable = require('../../support/helpers/is-callable')
const set = require('lodash/set')

class CollectionConnector {
  constructor(config) {
    this.config = config
  }

  collect() {
    let content = {}

    if (this.config.content) {
      content = this.getContent(this.config.content)
    }

    return new Collection(content)
  }

  getContent(content) {
    if (isCallable(content.keys)) {
      return this.getContentFromContext(content)
    }

    return content
  }

  getContentFromContext(context) {
    const content = {}

    for (const key of context.keys()) {
      set(content, key.replace(/\//g, '.'), context(key))
    }

    return content
  }
}

module.exports = CollectionConnector
