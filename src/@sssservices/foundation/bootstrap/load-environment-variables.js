// <?php

// namespace Illuminate\Foundation\Bootstrap;

// use Dotenv\Dotenv;
// use Dotenv\Exception\InvalidPathException;
// use Symfony\Component\Console\Input\ArgvInput;
// use Illuminate\Contracts\Foundation\Application;

const dotenv = require('dotenv')
const path = require('path')

class LoadEnvironmentVariables {
  bootstrap(app) {
    if (app.configurationIsCached()) {
      return
    }

    this.checkForSpecificEnvironmentFile(app)

    try {
      dotenv.config({
        path: path.posix.resolve(app.environmentPath(), app.environmentFile())
      })
    } catch (err) {
      //
    }
  }

  checkForSpecificEnvironmentFile(app) {
    // if (php_sapi_name() == 'cli' && with(input = new ArgvInput).hasParameterOption('--env')) {
    //     this.setEnvironmentFilePath(
    //         app, app.environmentFile().'.'.input.getParameterOption('--env')
    //     );
    // }

    if (!env('APP_ENV')) {
      return
    }

    this.setEnvironmentFilePath(
      app,
      app.environmentFile() + '.' + env('APP_ENV')
    )
  }

  setEnvironmentFilePath(app, file) {
    if (fs.existsSync(app.environmentPath(file))) {
      app.loadEnvironmentFrom(file)
    }
  }
}

module.exports = LoadEnvironmentVariables
