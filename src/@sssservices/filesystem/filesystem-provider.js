const Provider = require('../support/provider')
const FilesystemManager = require('./filesystem-manager')

class FilesystemProvider extends Provider {
  register() {
    this.registerNativeFilesystem()

    this.registerFlysystem()
  }

  registerNativeFilesystem() {
    this.app.singleton('files', app => {
      // return new Filesystem()
    })
  }

  registerFlysystem() {
    this.registerManager()

    this.app.singleton('filesystem.disk', app => {
      return this.app.make('filesystem').disk(this.getDefaultDriver())
    })

    this.app.singleton('filesystem.cloud', app => {
      return this.app.make('filesystem').disk(this.getCloudDriver())
    })
  }

  registerManager() {
    this.app.singleton('filesystem', app => {
      return new FilesystemManager(app)
    })
  }

  getDefaultDriver() {
    return this.app.make('config').get('filesystems.default')
  }

  getCloudDriver() {
    return this.app.make('config').get('filesystems.cloud')
  }
}

module.exports = FilesystemProvider
