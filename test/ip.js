import test from 'ava'
import http from 'supertest'
import koaRequestFilter from '../'
import app from './helpers/app'

// IP include

test('include should succeed', async t => {
  const opts = {
    rules: {
      ip: {
        include() {
          return ['127.*.*.1']
        }
      }
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('include should faild', async t => {
  const opts = {
    rules: {
      ip: {
        include: ['127.*.*.1', '!127.0.0.*']
      }
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})

// IP exclude

test('exclude should succeed', async t => {
  const opts = {
    rules: {
      ip: {
        exclude: ['123.*.34.*']
      }
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 200)
  t.is(res.body.code, 0)
})

test('exclude should faild', async t => {
  const opts = {
    rules: {
      ip: {
        exclude: ['127.*.*.1']
      }
    }
  }
  const server = app(koaRequestFilter(opts))
  const res = await http(server.listen()).get('/api/user')
  t.is(res.status, 403)
  t.is(res.text, 'FORBIDDEN_CONTENT')
})
