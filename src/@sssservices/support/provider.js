class Provider {
  constructor(app) {
    this.app = app
  }

  register() {
    // abstract
  }

  boot() {
    // abstract
  }
}

module.exports = Provider
