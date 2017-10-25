const Provider = require('../support/provider')
const Container = require('../container/container')
const LogProvider = require('../log/log-provider')
const EventProvider = require('../events/event-provider')
const includes = require('../support/helpers/includes')

class Application extends Container {
  constructor() {
    super()

    this.providers = []

    this.registeredProviders = []

    this.registerBaseBindings()

    this.registerBaseProviders()
  }

  version() {
    return this.constructor.VERSION
  }

  registerBaseBindings() {
    this.constructor.setInstance(this)

    this.instance('container', this)

    this.instance('app', this)
  }

  registerBaseProviders() {
    this.register(LogProvider)

    this.register(EventProvider)
  }

  bootstrapWith(bootstrappers) {
    this.hasBeenBootstrapped = true

    for (const bootstrapper of bootstrappers) {
      this.resolveModule(bootstrapper).bootstrap(this)
    }
  }

  registerConfiguredProviders() {
    const providers = this.make('config').get('app.providers')

    for (const provider of providers) {
      this.register(provider)
    }
  }

  register(provider) {
    provider = this.resolveProvider(provider, this)

    if (this.isRegistered(provider)) {
      return provider
    }

    provider.register()

    if (this.booted) {
      provider.boot()
    }

    this.registeredProviders.push(provider.constructor)

    this.providers.push(provider)

    return provider
  }

  isRegistered(provider) {
    return includes(this.registeredProviders, provider.constructor)
  }

  resolveProvider(provider, ...parameters) {
    if (provider instanceof Provider) {
      return provider
    }

    return this.resolveModule(provider, ...parameters)
  }

  resolveModule(abstract, ...parameters) {
    if (typeof abstract === 'string') {
      return this.makeWith(abstract, parameters)
    }

    const concrete = abstract.default || abstract

    return new concrete(...parameters)
  }

  boot() {
    if (this.booted) {
      return
    }

    for (const provider of this.providers) {
      provider.boot()
    }

    this.booted = true
  }

  handle(request) {
    return this.make('kernel').handle(request)
  }

  shouldSkipMiddleware() {
    return (
      this.bound('middleware.disable') &&
      this.make('middleware.disable') === true
    )
  }

  abort(code, message = '') {
    // if (code == 404) {
    //     throw new NotFoundHttpException(message)
    // }
    // throw new HttpException(code, message, null, headers)
  }

  // provideFacades(namespace)
  // {
  //     AliasLoader::setFacadeNamespace(namespace)
  // }
}

Application.VERSION = '0.0.1'

module.exports = Application
