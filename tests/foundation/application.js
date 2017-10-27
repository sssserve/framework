const Dispatcher = require('../../src/@sssservices/events/dispatcher')
const Application = require('../../src/@sssservices/foundation/application')
const test = require('ava')

test.beforeEach(t => {
  t.context.app = new Application()
})

test('it registers base bindings', t => {
  t.true(t.context.app.make('container') === t.context.app)
  t.true(t.context.app.make('app') === t.context.app)
})

test('it registers base providers', t => {
  t.true(t.context.app.make('events') instanceof Dispatcher)
  t.true(t.context.app.make('log') === console)
})
