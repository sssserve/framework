class Facade {
  static swap(instance) {
    this.resolvedInstances[this.getFacadeAccessor()] = instance

    if (this.app) {
      this.app.instance(this.getFacadeAccessor(), instance)
    }
  }

  static getFacadeRoot() {
    return this.resolveFacadeInstance(this.getFacadeAccessor())
  }

  static getFacadeAccessor() {
    throw new Error('Facade does not implement getFacadeAccessor method.')
  }

  static resolveFacadeInstance(name) {
    if (typeof name !== 'string') {
      return name
    }

    if (this.resolvedInstances[name]) {
      return this.resolvedInstances[name]
    }

    const instance = this.app.make(name)

    this.resolvedInstances[name] = instance

    return instance
  }

  static clearResolvedInstance(name) {
    delete this.resolvedInstances[name]
  }

  static clearResolvedInstances() {
    this.resolvedInstances = {}
  }

  static getFacadeApplication() {
    return this.app
  }

  static setFacadeApplication(app) {
    this.app = app
  }

  static facade() {
    return new Proxy(this, {
      get(target, key) {
        return key in target ? target[key] : target.getFacadeRoot()[key]
      }
    })
  }
}

Facade.resolvedInstances = {}

module.exports = Facade
