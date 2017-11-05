const isCallable = require('@sssservices/support/helpers/is-callable')

class Container {
  constructor() {
    this.bindings = {}
    this.instances = {}
    this.aliases = {}
  }

  bound(abstract) {
    return (
      this.bindings.hasOwnProperty(abstract) ||
      this.instances.hasOwnProperty(abstract) ||
      this.isAlias(abstract)
    )
  }

  isShared(abstract) {
    return (
      this.instances.hasOwnProperty(abstract) ||
      (this.bindings[abstract] && this.bindings[abstract]['shared'] === true)
    )
  }

  isAlias(name) {
    return this.aliases.hasOwnProperty(name)
  }

  bind(abstract, concrete, shared = false) {
    this.dropStaleInstances(abstract)

    if (!concrete) {
      concrete = abstract
    }

    if (!isCallable(concrete)) {
      concrete = this.getCallable(abstract, concrete)
    }

    this.bindings[abstract] = { concrete, shared }

    Object.defineProperty(this, abstract, {
      get() {
        return this.make(abstract)
      }
    })
  }

  getCallable(abstract, concrete) {
    return function(container, parameters) {
      if (abstract === concrete) {
        return container.build(concrete, parameters)
      }

      return container.makeWith(concrete, parameters)
    }
  }

  singleton(abstract, concrete) {
    this.bind(abstract, concrete, true)
  }

  instance(abstract, instance) {
    delete this.aliases[abstract]

    this.instances[abstract] = instance
  }

  alias(abstract, alias) {
    this.aliases[alias] = abstract
  }

  factory(abstract) {
    return function(...parameters) {
      return this.makeWith(abstract, parameters)
    }
  }

  makeWith(abstract, parameters) {
    return this.resolve(abstract, parameters)
  }

  make(abstract, ...parameters) {
    return this.resolve(abstract, parameters)
  }

  resolve(abstract, parameters) {
    abstract = this.getAlias(abstract)

    if (this.instances[abstract]) {
      return this.instances[abstract]
    }

    const concrete = this.getConcrete(abstract)

    const object = this.isBuildable(concrete, abstract)
      ? this.build(concrete, parameters)
      : this.makeWith(concrete, parameters)

    if (this.isShared(abstract)) {
      this.instances[abstract] = object
    }

    return object
  }

  getConcrete(abstract) {
    if (this.bindings[abstract]) {
      return this.bindings[abstract]['concrete']
    }

    return abstract
  }

  isBuildable(concrete, abstract) {
    return concrete === abstract || isCallable(concrete)
  }

  build(concrete, parameters = []) {
    if (isCallable(concrete)) {
      return concrete(this, ...parameters)
    }

    try {
      var Constructor = this.getConstructor(concrete)
    } catch (err) {
      this.notInstantiable(concrete)
    }

    return new Constructor(...parameters)
  }

  getConstructor(concrete) {
    let Constructor = global[concrete]

    if (!Constructor) {
      Constructor = require(concrete)
    }

    return Constructor.default || Constructor
  }

  notInstantiable(concrete) {
    // throw new BindingResolutionException(message)
    throw new Error(`Target [${concrete}] is not instantiable.`)
  }

  getBindings() {
    return this.bindings
  }

  getAlias(abstract) {
    if (!this.aliases[abstract]) {
      return abstract
    }

    if (this.aliases[abstract] === abstract) {
      // throw new LogicException(`[${abstract}] is aliased to itself.`)
      throw new Error(`[${abstract}] is aliased to itself.`)
    }

    return this.getAlias(this.aliases[abstract])
  }

  dropStaleInstances(abstract) {
    delete this.instances[abstract]
    delete this.aliases[abstract]
  }

  forgetInstance(abstract) {
    delete this.instances[abstract]
  }

  forgetInstances() {
    this.instances = {}
  }

  flush() {
    this.aliases = {}
    this.bindings = {}
    this.instances = {}
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new this()
    }

    return this.instance
  }

  static setInstance(container) {
    this.instance = container

    return container
  }
}

module.exports = Container
