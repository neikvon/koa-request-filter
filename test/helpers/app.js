const Koa = require('koa')
const Router = require('koa-router')

module.exports = (fn, pre) => {
  const app = new Koa()
  const router = new Router()

  router.get('/home', ctx => {
    ctx.body = 'welcome'
  })

  router.get('/api/user', ctx => {
    ctx.body = {
      code: 0,
      data: 'success'
    }
  })

  if (pre) {
    app.use(pre)
  }

  app.use(fn)
  app.use(router.routes()).use(router.allowedMethods())
  return app
}
