const Koa = require('koa')
const Router = require('koa-router')
const koaRequestFilter = require('../')

const app = new Koa()
const router = new Router()

// Set routes
router.get('/home', ctx => {
  ctx.body = 'welcome'
})

router.get('/api/user', ctx => {
  ctx.body = {
    code: 0,
    data: 'success'
  }
})

// Set cookies
app.use(async (ctx, next) => {
  ctx.cookies.set('user', 'echo1')
  await next()
})

// Filters
app.use(
  koaRequestFilter({
    // Test methods: ['GET'],
    include: ['/api'],
    rules: {
      cookies: [
        {
          name: 'user',
          include: ['echo']
        }
      ],
      headers: [
        {
          name: 'referer',
          exclude: ['http://www.xx.com/']
        }
      ],
      ip: {
        exclude: ['100.100.100.100']
      }
    }
  })
)

app.use(router.routes()).use(router.allowedMethods())

app.listen(3999, err => {
  if (err) {
    throw err
  }

  console.log('Server running on http://localhost:3999')
})
