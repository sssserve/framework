class Kernel {
  constructor(app, events) {
    if (!process.env.SSSSERVE_BINARY) {
      process.env.SSSSERVE_BINARY = 'sssserve'
    }

    this.app = app
    this.events = events
    this.bootstrappers = [
      '@sssservices/foundation/bootstrap/load-configuration',
      '@sssservices/foundation/bootstrap/register-providers',
      '@sssservices/foundation/bootstrap/boot-providers'
    ]
  }

  handle(input, output) {
    try {
      this.bootstrap()

      if (!this.commandsLoaded) {
        this.commands()

        this.commandsLoaded = true
      }

      return this.getSssserve().run(input, output)
    } catch (err) {
      this.reportError(err)

      this.renderError(output, err)

      return 1
    }
  }

  terminate(input, status) {
    this.app.terminate()
  }

  // commands() {
  //   //
  // }

  command(signature, callback) {
    const command = new ClosureCommand(signature, callback)

    Sssserve.starting(sssserve => {
      sssserve.add(command)
    })

    return command
  }

  registerCommand(command) {
    this.getSssserve().add(command)
  }

  call(command, parameters, outputBuffer) {
    this.bootstrap()

    if (!this.commandsLoaded) {
      // this.commands()

      this.commandsLoaded = true
    }

    return this.getSssserve().call(command, parameters, outputBuffer)
  }

  all() {
    this.bootstrap()

    return this.getSssserve().all()
  }

  output() {
    this.bootstrap()

    return this.getSssserve().output()
  }

  bootstrap() {
    if (!this.app.hasBeenBootstrapped) {
      this.app.bootstrapWith(this.bootstrappers)
    }

    // this.app.loadDeferredProviders()
  }

  getSssserve() {
    if (!this.sssserve) {
      this.sssserve = new Sssserve(this.app, this.events, this.app.version())

      this.sssserve.resolveCommands(this.commands)
    }

    return this.sssserve
  }

  setSssserve(sssserve) {
    this.sssserve = sssserve
  }

  reportError(err) {
    this.app.make('error.handler').report(err)
  }

  renderError(output, err) {
    this.app.make('error.handler').renderForConsole(output, err)
  }
}

module.exports = Kernel
