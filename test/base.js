import test from 'ava'
import http from 'supertest'
import koaRequestFilter from '../'
import app from './helpers/app'

test('request home should succeed', async t => {
  const server = app(koaRequestFilter())
  const res = await http(server.listen()).get('/home')

  t.is(res.status, 200)
  t.is(res.text, 'welcome')
})
