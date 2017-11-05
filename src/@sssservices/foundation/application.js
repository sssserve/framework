const Provider = require('@sssservices/support/provider')
const Container = require('@sssservices/container/container')
const LogProvider = require('@sssservices/log/log-provider')
const EventProvider = require('@sssservices/events/event-provider')
const includes = require('@sssservices/support/helpers/includes')
const trimEnd = require('@sssservices/support/helpers/trim-end')
const path = require('path')

const VERSION = '0.0.1'

class Application extends Container {
  constructor(basePath) {
    super()

    this.bootingCallbacks = []
    this.bootedCallbacks = []
    this.terminatingCallbacks = []
    this.serviceProviders = []
    this.loadedProviders = {}
    this.deferredServices = {}

    if (basePath) {
      this.setBasePath(basePath)
    }

    this.registerBaseBindings()
    this.registerBaseProviders()
  }

  version() {
    return VERSION
  }

  registerBaseBindings() {
    this.constructor.setInstance(this)

    this.instance('app', this)

    this.instance('@sssservices/container/container', this)
  }

  registerBaseProviders() {
    this.register(new LogProvider(this))

    this.register(new EventProvider(this))

    this.register(new RoutingServiceProvider(this))
  }

  bootstrapWith(bootstrappers) {
    this.hasBeenBootstrapped = true

    for (const bootstrapper of bootstrappers) {
      this.make('events').emit(`bootstrapping: {bootstrapper}`, this)

      this.make(bootstrapper).bootstrap(this)

      this.make('events').emit(`bootstrapped: ${bootstrapper}`, this)
    }
  }

  afterLoadingEnvironment(callback) {
    return this.afterBootstrapping(
      'sssservices/foundation/bootstrap/load-environment-variables',
      callback
    )
  }

  beforeBootstrapping(bootstrapper, callback) {
    this.make('events').on(`bootstrapping: ${bootstrapper}`, callback)
  }

  afterBootstrapping(bootstrapper, callback) {
    this.make('events').on(`bootstrapped: ${bootstrapper}`, callback)
  }

  setBasePath(basePath) {
    this._basePath = trimEnd(basePath, '/')

    this.bindPathsInContainer()

    return this
  }

  bindPathsInContainer() {
    this.instance('path', this.path())
    this.instance('path.base', this.basePath())
    this.instance('path.config', this.configPath())
    this.instance('path.public', this.publicPath())
    this.instance('path.storage', this.storagePath())
    this.instance('path.content', this.contentPath())
    this.instance('path.resources', this.resourcePath())
    this.instance('path.bootstrap', this.bootstrapPath())
  }

  path(...parameters) {
    return this.basePath('app', ...parameters)
  }

  basePath(...parameters) {
    return path.posix.resolve(this._basePath, ...parameters)
  }

  bootstrapPath(...parameters) {
    return this.basePath('bootstrap', ...parameters)
  }

  configPath(...parameters) {
    return this.basePath('config', ...parameters)
  }

  publicPath(...parameters) {
    return this.basePath('public', ...parameters)
  }

  storagePath(...parameters) {
    return this.basePath('storage', ...parameters)
  }

  contentPath(...parameters) {
    return this.basePath('content', ...parameters)
  }

  resourcePath(...parameters) {
    return this.basePath('resources', ...parameters)
  }

  bootstrapPath(...parameters) {
    return this.basePath('bootstrap', ...parameters)
  }

  environmentPath() {
    return this._environmentPath || this._basePath
  }

  useEnvironmentPath(path) {
    this._environmentPath = path

    return this
  }

  loadEnvironmentFrom(file) {
    this._environmentFile = file

    return this
  }

  environmentFile() {
    return this._environmentFile || '.env'
  }

  environmentFilePath() {
    return this.environmentPath(this.environmentFile())
  }

  environment(...parameters) {
    const patterns = flattenDeep(parameters)

    if (patterns.length) {
      return includes(patterns, this.env)
    }

    return this.env
  }

  isLocal() {
    return this.env === 'local'
  }

  detectEnvironment(callback) {
    const detector = new EnvironmentDetector()

    this.env = detector.detector(callback, process.argv)

    return this.env
  }

  runningInConsole() {
    return !!process
  }

  runningUnitTests() {
    return this.env === 'testing'
  }

  registerConfiguredProviders() {
    const repository = new ProviderRepository(
      this,
      new Filesystem(),
      this.getCachedServicesPath()
    )

    repository.load(this.make('config').get('app.providers'))
  }

  register(provider) {
    let registered = this.getProvider(provider)

    if (registered && !force) {
      return registered
    }

    if (isString(provider)) {
      provider = this.resolveProvider(provider)
    }

    if (isCallable(provider.register)) {
      provider.register()
    }

    this.markAsRegistered(provider)

    if (this.booted) {
      this.bootProvider(provider)
    }

    return provider
  }

  getProvider(provider) {
    const name = isString(provider) ? provider : getClass(provider)

    // return Arr::first(this.serviceProviders, value => {
    //     return value instanceof name;
    // });
  }

  resolveProvider(provider) {
    return new provider(this)
  }

  markAsRegistered(provider) {
    this.serviceProviders.push(provider)

    this.loadedProviders[getClass(provider)] = true
  }

  loadDeferredProviders() {
    for (const service in this.deferredServices) {
      this.loadDeferredProvider(service)
    }

    this.deferredServices = {}
  }

  loadDeferredProvider(service) {
    const provider = this.deferredServices[service]

    if (!provider) {
      return
    }

    if (!this.loadedProviders[provider]) {
      this.registerDeferredProvider(provider, service)
    }
  }

  registerDeferredProvider(provider, service) {
    if (service) {
      delete this.deferredServices[service]
    }

    const instance = new provider(this)

    this.register(instance)

    if (!this.booted) {
      this.booting(() => {
        this.bootProvider(instance)
      })
    }
  }

  makeWith(abstract, parameters) {
    abstract = this.getAlias(abstract)

    if (this.deferredServices[abstract]) {
      this.loadDeferredProvider(abstract)
    }

    return super.makeWith(abstract, parameters)
  }

  make(abstract, ...parameters) {
    return this.makeWith(abstract, parameters)
  }

  bound(abstract) {
    return !!this.deferredServices[abstract] || super.bound(abstract)
  }

  isBooted() {
    return this.booted
  }

  boot() {
    if (this.booted) {
      return
    }

    this.fireAppCallbacks(this.bootingCallbacks)

    for (const provider of this.providers) {
      this.bootProvider(provider)
    }

    this.booted = true

    this.fireAppCallbacks(this.bootedCallbacks)
  }

  bootProvider(provider) {
    if (isCallable(provider.boot)) {
      provider.boot()
    }
  }

  booting(callback) {
    this.bootingCallbacks.push(callback)
  }

  booted(callback) {
    this.bootedCallbacks.push(callback)

    if (this.isBooted()) {
      this.fireAppCallbacks([callback])
    }
  }

  fireAppCallbacks(callbacks) {
    for (const callback of callbacks) {
      callback()
    }
  }

  handle(request, type) {
    return this.make('@sssservices/contracts/http/kernel').handle(
      Request.createFromBase(request)
    )
  }

  shouldSkipMiddleware() {
    return (
      this.bound('middleware.disable') &&
      this.make('middleware.disable') === true
    )
  }

  getCachedServicesPath() {
    return this.bootstrapPath('cache', 'services.js')
  }

  configurationIsCached() {
    return this.make('files').exists(this.getCachedConfigPath())
  }

  getCachedConfigPath() {
    return this.bootstrapPath('cache', 'config.js')
  }

  routesAreCached() {
    return this.make('files').exists(this.getCachedRoutesPath())
  }

  getCachedRoutesPath() {
    return this.bootstrapPath('cache', 'routes.js')
  }

  isDownForMaintenance() {
    return this.make('files').exists(this.storagePath('framework', 'down'))
  }

  abort(code, message = '', headers = {}) {
    if (code === 404) {
      throw new NotFoundHttpException(message)
    }

    throw new HttpException(code, message, null, headers)
  }

  terminating(callback) {
    this.terminatingCallbacks.push(callback)

    return this
  }

  terminate() {
    for (const callback in this.terminatingCallbacks) {
      terminating.call(this)
      // this.call(terminating)
    }
  }

  addDeferredServices(services) {
    this.deferredServices = Object.assign(this.deferredServices, services)
  }

  isDeferredService(service) {
    return !!this.deferredServices[service]
  }

  getLocale() {
    return this.make('config').get('app.locale')
  }

  setLocale(locale) {
    this.make('config').set('app.locale', locale)

    this.make('translator').setLocale(locale)

    this.make('events').dispatch(new LocaleUpdated(locale))
  }

  isLocale(locale) {
    return this.getLocale() === locale
  }

  flush() {
    super.flush()

    this.loadedProviders = {}
  }
}

module.exports = Application
