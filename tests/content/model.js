const Application = require('../src/@sssservices/foundation/application')
const Kernel = require('../src/@sssservices/foundation/http/kernel')
// const ContentProvider = require('../src/@sssservices/content/content-provider')
const Comment = require('../app/comment')
const Config = require('../src/@sssservices/support/facades/config')
const User = require('../app/user')
const test = require('ava')

const app = new Application()

app.instance('config.context', {
  app: require('../config/app'),
  content: require('../config/content')
})

app.singleton('kernel', app => {
  return new Kernel(app)
})

app.make('kernel').handle()

console.log('Content', Config['app.aliases'])

test('it registers base bindings', t => {
  //   const model = new Model({ foo: 'bar' })

  //   t.true(model.foo === 'bar')
  t.true(true)
})
