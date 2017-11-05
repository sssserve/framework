require('module-autoload')

const Container = require('@sssservices/container/container')
const test = require('ava')

global.Foo = class Foo {
  constructor(value) {
    this.value = value
  }
}

test.beforeEach(t => {
  t.context.container = new Container()
})

test('it instatiates native classes', t => {
  const message = 'Foo'
  const err = t.context.container.make('Error', message)

  t.true(err instanceof Error)
  t.true(err.message === message)
})

test('it instatiates global classes', t => {
  const attribute = 'bar'
  const foo = t.context.container.make('Foo', attribute)

  t.true(foo instanceof Foo)
  t.true(foo.value === attribute)
})

test('it instatiates a singleton', t => {
  const foo = {}
  t.context.container.singleton('Foo', app => foo)

  t.true(t.context.container.make('Foo') === foo)
  t.true(t.context.container.make('Foo') === t.context.container.make('Foo'))
})

test('it instatiates an instance', t => {
  const foo = {}
  t.context.container.instance('Foo', foo)

  t.true(t.context.container.make('Foo') === foo)
  t.true(t.context.container.make('Foo') === t.context.container.make('Foo'))
})

test('it instatiates an alias', t => {
  const foo = {}
  t.context.container.instance('Foo', foo)
  t.context.container.alias('Foo', 'Bar')

  t.true(t.context.container.make('Bar') === foo)
})

test('it instatiates a module', t => {
  const name = '@sssservices/container/container'

  t.true(t.context.container.make(name) instanceof Container)
})

test('it throws an error when unable to instatiate', t => {
  t.throws(() => {
    t.context.container.make('Missing')
  }, 'Target [Missing] is not instantiable.')
})
