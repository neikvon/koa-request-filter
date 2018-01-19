import test from 'ava'
import http from 'supertest'
import koaRequestFilter from '../'
import app from './helpers/app'

async function setCookieUser(ctx, next) {
  ctx.cookies.set('user', 'echo')
  await next()
}

// Cookie include

test('include(function) should succeed', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          async include() {
            return ['echo']
          }
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('include(function) should faild', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          async include() {
            return ['xx']
          }
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

test('include(array) should succeed', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          include: ['echo']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('include(array) should faild', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          include: ['xx']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

// Cookie exclude

test('exclude(function) should succeed', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          async exclude() {
            return ['xx']
          }
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('exclude(function) should faild', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          async exclude() {
            return ['echo']
          }
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

test('exclude(array) should succeed', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          exclude: ['xx']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('exclude(array) should faild', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          exclude: ['echo']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts), setCookieUser)
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

test('empty cookie include(array) should faild', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          include: ['echo']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

test('empty cookie include(array) should succeed', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          include: ['echo', undefined]
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('empty cookie exclude(array) should succeed', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          exclude: ['echo']
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('empty cookie exclude(array) should faild', async t => {
  const opts = {
    rules: {
      cookies: [
        {
          name: 'user',
          exclude: ['echo', undefined]
        }
      ]
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})
