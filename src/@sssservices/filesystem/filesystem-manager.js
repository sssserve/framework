const Filesystem = require('./filesystem')
const ucFirst = require('../support/helpers/uc-first')

class FilesystemManager {
  constructor(app) {
    this.app = app
    this.disks = {}
  }

  drive(name) {
    return this.disk(name)
  }

  disk(name) {
    name = name || this.getDefaultDriver()

    this.disks[name] = this.get(name)

    return this.disks[name]
  }

  cloud() {
    name = this.getDefaultCloudDriver()

    this.disks[name] = this.get(name)

    return this.disks[name]
  }

  get(name) {
    return this.disks[name] || this.resolve(name)
  }

  resolve(name) {
    const config = this.getConfig(name)

    const driverMethod = `create${ucFirst(config.driver)}Driver`

    if (!this[driverMethod]) {
      throw new Error(`Driver [${config.driver}] is not supported.`)
    }

    return this[driverMethod](config)
  }

  createLocalDriver(config) {
    const permissions = config.permissions || []

    return new Filesystem(config)

    // const links = Arr::get(config, 'links') === 'skip'
    //     ? LocalAdapter::SKIP_LINKS
    //     : LocalAdapter::DISALLOW_LINKS;

    // return this.adapt(this.createFlysystem(new LocalAdapter(
    //     config.root, LOCK_EX, links, permissions
    // ), config));
  }

  // createFtpDriver(config) {
  // ftpConfig = Arr::only(config, [
  //     'host', 'username', 'password', 'port', 'root', 'passive', 'ssl', 'timeout',
  // ]);
  // return this.adapt(this.createFlysystem(
  //     new FtpAdapter(ftpConfig), config
  // ));
  // }

  // createS3Driver(config) {
  //   s3Config = this.formatS3Config(config)

  //   root = isset(s3Config['root']) ? s3Config['root'] : null

  //   options = isset(config['options']) ? config['options'] : []

  //   return this.adapt(
  //     this.createFlysystem(
  //       new S3Adapter(
  //         new S3Client(s3Config),
  //         s3Config['bucket'],
  //         root,
  //         options
  //       ),
  //       config
  //     )
  //   )
  // }

  set(name, disk) {
    this.disks[name] = disk
  }

  getConfig(name) {
    return this.app.make('config').get(`filesystems.disks.${name}`)
  }

  getDefaultDriver() {
    return this.app.make('config').get('filesystems.default')
  }

  getDefaultCloudDriver() {
    return this.app.make('config').get('filesystems.cloud')
  }
}

module.exports = FilesystemManager
