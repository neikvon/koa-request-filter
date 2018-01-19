const debug = require('debug')('koa-filter')
const ipFilter = require('ip-filter')
const schemaRules = require('./schema')
const {isMatch, getCookie, ensureArray, getIp, schemaCheck} = require('./utils')

const defaults = {
  include: '',
  exclude: '',
  methods: '',
  error: {
    status: 403,
    code: 'FORBIDDEN_CONTENT'
  },
  rules: {}
}

function setError(ctx, opts) {
  ctx.status = opts.error.status
  ctx.body = opts.error.code
}

module.exports = options => {
  const opts = Object.assign({}, defaults, options)
  debug('opts:', JSON.stringify(opts, null, 2))

  const message = schemaCheck(opts, schemaRules)
  if (message) {
    throw new TypeError(message)
  }

  return async (ctx, next) => {
    // Excludes
    const excludeMatch = isMatch(ctx.url, opts.exclude)
    debug('excludeMatch:', excludeMatch)
    if (excludeMatch) {
      return next()
    }

    // Includes
    const includeMatch = isMatch(ctx.url, opts.include, true)
    debug('includeMatch:', includeMatch)
    if (!includeMatch) {
      return next()
    }

    // Methods
    const methodMatch = isMatch(ctx.method, opts.methods, true)
    debug('methodMatch:', methodMatch)
    if (!methodMatch) {
      return next()
    }

    // Rules
    if (!opts.rules) {
      return next()
    }

    const rules = opts.rules

    // Rules: cookies
    if (rules.cookies && rules.cookies.length > 0) {
      let shouldReturn = false
      for (let i = 0, len = rules.cookies.length; i < len; i++) {
        if (shouldReturn) {
          break
        }
        const cookieInclude = await ensureArray(
          rules.cookies[i].include,
          `rules.cookies[${i}].include`
        )
        const cookieExclude = await ensureArray(
          rules.cookies[i].exclude,
          `rules.cookies[${i}].exclude`
        )
        const cookieFound = getCookie(ctx, rules.cookies[i].name)
        debug('cookieFound:', cookieFound)
        if (
          (cookieExclude.length > 0 && cookieExclude.includes(cookieFound)) ||
          (cookieInclude.length > 0 && !cookieInclude.includes(cookieFound))
        ) {
          setError(ctx, opts)
          shouldReturn = true
        }
      }

      debug('shouldReturn(cookies):', shouldReturn)
      if (shouldReturn) {
        return
      }
    }

    // Rules: headers
    if (rules.headers && rules.headers.length > 0) {
      let shouldReturn = false
      for (let i = 0, len = rules.headers.length; i < len; i++) {
        if (shouldReturn) {
          break
        }
        const header = rules.headers[i]
        const headerFound = ctx.headers[header.name]

        if (header.exclude instanceof RegExp) {
          if (header.exclude.test(headerFound)) {
            setError(ctx, opts)
            shouldReturn = true
            break
          }
        } else {
          const headerExclude = await ensureArray(
            header.exclude,
            `rules.headers[${i}].exclude`
          )
          if (headerExclude.length > 0 && headerExclude.includes(headerFound)) {
            setError(ctx, opts)
            shouldReturn = true
            break
          }
        }

        if (header.include instanceof RegExp) {
          if (!header.include.test(headerFound)) {
            setError(ctx, opts)
            shouldReturn = true
            break
          }
        } else {
          const headerInclude = await ensureArray(
            header.include,
            `rules.headers[${i}].include`
          )
          if (
            headerInclude.length > 0 &&
            !headerInclude.includes(headerFound)
          ) {
            setError(ctx, opts)
            shouldReturn = true
            break
          }
        }
      }

      debug('shouldReturn(headers):', shouldReturn)
      if (shouldReturn) {
        return
      }
    }

    // Rules: ip
    if (rules.ip) {
      const ipInclude = await ensureArray(rules.ip.include, 'rules.ip.include')
      const ipExclude = await ensureArray(rules.ip.exclude, 'rules.ip.exclude')
      const ipFound = ctx.ips.length > 0 ? getIp(ctx.ips) : getIp(ctx.ip)
      if (
        (ipExclude.length > 0 &&
          ipFilter(ipFound, ipExclude, {strict: false})) ||
        (ipInclude.length > 0 && !ipFilter(ipFound, ipInclude, {strict: false}))
      ) {
        setError(ctx, opts)
        return
      }
    }

    return next()
  }
}
