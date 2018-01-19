import test from 'ava'
import http from 'supertest'
import koaRequestFilter from '../'
import app from './helpers/app'

async function setCookieUser(ctx, next) {
  ctx.cookies.set('user', 'echo')
  await next()
}

// All
test('all should succeed', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          async include() {
            return ['echo']
          },
          exclude: ['echo1', 'echo2']
        }
      ],
      headers: [
        {
          name: 'referer',
          include: ['http://www.qq.com'],
          exclude: ['http://www.baidu.com']
        },
        {
          name: 'user-agent',
          include: /AppleWebKit/g,
          exclude: /noexist/g
        }
      ],
      ip: {
        include: ['127.*.*.1'],
        exclude: ['127.1.1.1']
      }
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen())
    .get('/api/user')
    .set('referer', 'http://www.qq.com')
    .set(
      'user-agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
    )
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})
