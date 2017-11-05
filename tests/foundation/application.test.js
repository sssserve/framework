require('module-autoload')

const Dispatcher = require('@sssservices/events/dispatcher')
const Application = require('@sssservices/foundation/application')
const posix = require('path').posix
const test = require('ava')

function resolve(...path) {
  return posix.resolve(__dirname, ...path)
}

test.beforeEach(t => {
  const app = new Application(resolve('fixtures'))

  app.bootstrapWith(['@sssservices/foundation/bootstrap/load-configuration'])

  t.context.app = app
})

test('it binds base paths', t => {
  t.true(t.context.app.make('path.base') === resolve('fixtures'))
  t.true(t.context.app.basePath('foo') === resolve('fixtures', 'foo'))
})

test('it registers base bindings', t => {
  t.true(t.context.app.make('container') === t.context.app)
  t.true(t.context.app.make('app') === t.context.app)
})

test('it registers base providers', t => {
  t.true(t.context.app.make('events') instanceof Dispatcher)
  t.true(t.context.app.make('log') === console)
})
