import test from 'ava'
import http from 'supertest'
import koaRequestFilter from '../'
import app from './helpers/app'

// Headers: referer include

test('referer include should succeed', async t => {
  const opts = {
    rules: {
      headers: [
        {
          name: 'referer',
          include: ['http://www.qq.com']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen())
    .get('/api/user')
    .set('referer', 'http://www.qq.com')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('referer include should faild', async t => {
  const opts = {
    rules: {
      headers: [
        {
          name: 'referer',
          include: ['http://www.xx.com']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen())
    .get('/api/user')
    .set('referer', 'http://www.qq.com')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

// Headers: referer exclude

test('referer exclude should succeed', async t => {
  const opts = {
    rules: {
      headers: [
        {
          name: 'referer',
          exclude: ['']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen())
    .get('/api/user')
    .set('referer', 'http://www.qq.com')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('referer exclude should faild', async t => {
  const opts = {
    rules: {
      headers: [
        {
          name: 'referer',
          exclude: ['http://www.xx.com', 'http://www.qq.com']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen())
    .get('/api/user')
    .set('referer', 'http://www.qq.com')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

// Headers: User Agent include

test('User Agent include should succeed', async t => {
  const opts = {
    rules: {
      headers: [
        {
          name: 'user-agent',
          include: /AppleWebKit/g
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen())
    .get('/api/user')
    .set(
      'user-agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
    )
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('User Agent include should faild', async t => {
  const opts = {
    rules: {
      headers: [
        {
          name: 'user-agent',
          include: /AppleWebKit/g
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen())
    .get('/api/user')
    .set(
      'user-agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) Chrome/63.0.3239.84 Safari/537.36'
    )
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

// Headers: User Agent exclude

test('User Agent exclude should succeed', async t => {
  const opts = {
    rules: {
      headers: [
        {
          name: 'user-agent',
          exclude: /AppleWebKit/g
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen())
    .get('/api/user')
    .set(
      'user-agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) Chrome/63.0.3239.84 Safari/537.36'
    )
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('User Agent exclude should faild', async t => {
  const opts = {
    rules: {
      headers: [
        {
          name: 'user-agent',
          exclude: /AppleWebKit/g
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen())
    .get('/api/user')
    .set(
      'user-agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
    )
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})
