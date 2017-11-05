const remove = require('@sssservices/support/helpers/remove')

class Dispatcher {
  constructor() {
    this.events = {}
  }

  on(type, callback, context) {
    let callbacks = this.events[type]

    if (!callbacks) {
      callbacks = this.events[type] = []
    }

    if (context) {
      callback = callback.bind(context)
    }

    callbacks.push(callback)

    return this
  }

  off(type, callback) {
    let callbacks = this.events[type]

    if (!callbacks) {
      return this
    }

    remove(this.callbacks, callback)

    if (!callbacks.length) {
      delete this.events[type]
    }

    return this
  }

  emit(type, ...params) {
    let callbacks = this.events[type] || []

    if (callbacks) {
      for (const callback of callbacks) {
        callback(...params)
      }
    }

    return this
  }

  destroy() {
    this.clear()
  }

  clear() {
    this.events = {}
  }
}

module.exports = Dispatcher
