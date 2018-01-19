# koa-request-filter


## Install

```bash
$ yarn add koa-request-filter
```

or

```bash
$ npm i koa-request-filter
```

## Usage

```js
const Koa = require('koa')
const koaRequestFilter = require('koa-request-filter')

const app = new Koa()
app.use(koaRequestFilter(options))

// full example: https://github.com/neikvon/koa-request-filter/blob/master/example/index.js
```

## Options

- `methods {array}`: optional
  - Example: `['GET', 'POST', 'PUT', 'DELETE']`
- `include {array}`: optional
  - Example: `['/api']`
- `exclude {array}`: optional
  - Example: `['/api']`
- `error {object}`: optional
  - `status {number}`
  - `code {string}`
- `rules {object}`: optional
  - `cookies {array}`
  - `headers {array}`
  - `ip {object}`

## Options example

```js
methods: ['GET', 'POST', 'PUT', 'DELETE'],
include: [],
exclude: [],
rules: {
  cookies: [
    {
      // string|array
      name: 'user', 
      // function|array|regexp
      async include() {
        return ['echo']
      },
      // function|array|regexp
      exclude: ['echo1', 'echo2']
    }
  ],
  headers: [
    {
      // string|array
      name: 'referer',
      // function|array|regexp
      include: ['http://www.qq.com'],
      // function|array|regexp
      exclude: ['http://www.baidu.com']
    },
    {
      name: 'user-agent',
      include: /AppleWebKit/g,
      exclude: /noexist/g
    }
  ],
  // https://www.npmjs.com/package/ip-filter
  ip: {
    // function|array
    include: ['127.*.*.1'],
    // function|array
    exclude: ['127.1.1.1']
  }
},
error: {
  status: 403,
  code: 'FORBIDDEN_CONTENT'
}
```