class HandleExceptions {
  bootstrap(app) {
    this.app = app

    // error_reporting(-1);

    // set_error_handler([this, 'handleError']);

    // set_exception_handler([this, 'handleException']);

    // register_shutdown_function([this, 'handleShutdown']);

    if (!app.environment('testing')) {
      // ini_set('display_errors', 'Off');
    }
  }

  handleError(level, message, file = '', line = 0, context) {
    // if (error_reporting() & level) {
    //   throw new ErrorException(message, 0, level, file, line)
    // }
  }

  handleException(err) {
    if (!err instanceof Error) {
      // e = new FatalThrowableError(e)
    }

    this.getExceptionHandler().report(err)

    if (this.app.runningInConsole()) {
      this.renderForConsole(err)
    } else {
      this.renderHttpResponse(err)
    }
  }

  renderForConsole(err) {
    // this.getExceptionHandler().renderForConsole(new ConsoleOutput(), e)
  }

  renderHttpResponse(err) {
    this.getExceptionHandler()
      .render(this.app.make('request'), err)
      .send()
  }

  handleShutdown() {
    // if (!is_null((error = error_get_last())) && this.isFatal(error['type'])) {
    //   this.handleException(this.fatalExceptionFromError(error, 0))
    // }
  }

  fatalExceptionFromError(error, traceOffset = null) {
    // return new FatalErrorException(
    //     error['message'], error['type'], 0, error['file'], error['line'], traceOffset
    // );
  }

  isFatal(type) {
    // return in_array(type, [E_COMPILE_ERROR, E_CORE_ERROR, E_ERROR, E_PARSE]);
  }

  getExceptionHandler() {
    return this.app.make('exception.handler')
  }
}

module.exports = HandleExceptions
