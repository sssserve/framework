const path = require('path')
const semver = require('semver')
const { spawn } = require('child_process')
const Manager = require('./manager')

class Publisher {
  constructor(basepath) {
    this.basepath = basepath

    this.namespace = 'sssservices'

    this.manager = new Manager(this)
  }

  path(...parameters) {
    return path.resolve(this.basepath, ...parameters)
  }

  subpath(...parameters) {
    return this.path('src', `@${this.namespace}`, ...parameters)
  }

  handle(command) {
    const release = command.length && command[0]

    if (!release) {
      throw new Error('Publishing requires a version release.')
    }

    const version = semver.inc(this.manager.version(), release)

    if (!version) {
      throw new Error(`Version release [${release}] does not exist.`)
    }

    return this.publish(release, version)
  }

  publish(release, version) {
    this.release = release

    this.config.version = version

    for (const name in this.modules) {
      this.modules[name] = `^${version}`

      this.sync(name.split('/').pop())
    }

    this.commit()
  }

  commit(name) {
    const saved = this.manager.save(name)

    const command = this.getCommitCommand(name)

    this.run(command)
  }

  run(command) {
    return spawn(command, {
      stdio: 'inherit',
      shell: true
    })
  }

  getCommitCommand(name) {
    return `
      cd ${this.manager.resolve(name)} &&
      git add . &&
      git commit -m 'publish ${this.release}' &&
      git push -u origin master &&
      npm publish --public
    `
  }

  sync(name) {
    const config = this.manager.config(name)

    this.syncVersion(config)

    this.syncDependencies(config)

    this.commit(name)
  }

  syncVersion(config) {
    config.version = this.version
  }

  syncDependencies(config) {
    for (const dependency in config.dependencies) {
      let version = `^${this.version}`

      if (this.isExternal(dependency)) {
        version = this.dependencies[dependency]
      }

      config.dependencies[dependency] = version
    }
  }

  isExternal(dependency) {
    return dependency[0] !== '@'
  }

  get config() {
    return this.manager.config()
  }

  get version() {
    return this.config.version
  }

  get modules() {
    return this.config.dependencies
  }

  get dependencies() {
    return this.config.devDependencies
  }
}

module.exports = Publisher
