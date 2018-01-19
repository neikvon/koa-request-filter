const isObject = obj => obj && obj.constructor && obj.constructor === Object
let message = ''

function typeCheck(type, obj) {
  let msg = ''
  switch (type) {
    case 'string':
      msg = typeof obj === 'string' ? '' : 'string'
      break
    case 'array':
      msg = Array.isArray(obj) ? '' : 'array'
      break
    case 'object':
      msg = isObject(obj) ? '' : 'object'
      break
    case 'function':
      msg = typeof obj === 'function' ? '' : 'function'
      break
    case 'regexp':
      msg = obj instanceof RegExp ? '' : 'regexp'
      break
    default:
      break
  }
  return msg
}

function schemaCheck(obj, rules, parent) {
  if (!obj) {
    return 'options should not be null.'
  }

  const keys = Object.keys(obj)
  const prefix = parent ? `${parent}.` : ''

  if (keys.length < 1) {
    const required = []
    Object.keys(rules).map(item => {
      if (rules[item].required) {
        required.push(prefix + item)
      }
      return true
    })
    if (required.length > 0) {
      message += `\n${required.join(',')} required`
    }
  }

  for (let i = 0, len = keys.length; i < len; i++) {
    const item = keys[i]
    const rule = rules[item]
    if (rule) {
      if (rule.required && !obj[item]) {
        message += `\n${prefix}${item} required.`
        break
      }

      const types = rule.types

      if (obj[item]) {
        if (rule._type === 'array') {
          const _types = rule._types
          if (Array.isArray(obj[item])) {
            // Array
            obj[item].map((v, idx) => {
              // Object
              return Object.keys(v).map(k => {
                // Array
                let itemError = ''
                let pass = false
                for (let i = 0, len = _types[k].length; i < len; i++) {
                  if (pass) {
                    break
                  }

                  itemError = typeCheck(_types[k][i], v[k])
                  pass = !itemError
                }
                if (itemError) {
                  message += `\n${prefix}${item}[${idx}].${k} should be ${_types[
                    k
                  ].join(' or ')}`
                }
                return true
              })
            })
          } else {
            message += `\n${prefix}${item} should be array`
          }
        } else {
          let itemError = ''
          let pass = false
          for (let i = 0, len = types.length; i < len; i++) {
            if (pass) {
              break
            }
            itemError = typeCheck(types[i], obj[item])
            pass = !itemError
          }
          if (itemError) {
            message += `\n${prefix}${item} should be ${types.join(' or ')}`
          }
        }
      }

      if (rule.children) {
        schemaCheck(obj[item], rule.children, prefix + item)
      }
    }
  }

  return message
}

function isMatch(target, filters, flag) {
  let match = Boolean(flag)
  if (!filters) {
    return match
  }

  if (Array.isArray(filters)) {
    for (let i = 0, len = filters.length; i < len; i++) {
      if (target.indexOf(filters[i]) > -1) {
        match = true
        break
      }
    }
  } else if (target.indexOf(filters) > -1) {
    match = true
  }

  return match
}

function getCookie(ctx, name) {
  let found = ''
  if (ctx.cookies) {
    if (Array.isArray(name)) {
      for (const item of name) {
        const tmp = ctx.cookies.get(item)
        if (tmp) {
          found = tmp
          break
        }
      }
    } else {
      found = ctx.cookies.get(name)
    }

    if (found) {
      return found
    }
  }

  // Demo: [ 'aa=ada; path=/; httponly', 'aa1=ada1; path=/; httponly' ]
  if (!ctx.res) {
    return found
  }
  const c2 = ctx.res.getHeaders()['set-cookie']
  const obj = {}
  if (c2 && c2.length > 0) {
    c2.map(item => {
      const str = item.split(';')[0]
      const arr = str.split('=')
      obj[arr[0]] = arr[1]
      return true
    })
  }

  if (Array.isArray(name)) {
    for (const item of name) {
      const tmp = obj[item]
      if (tmp) {
        found = tmp
        break
      }
    }
  } else {
    found = obj[name]
  }
  return found
}

async function ensureArray(obj, name) {
  let ret = []
  if (typeof obj === 'function') {
    ret = await obj()
    if (!Array.isArray(ret)) {
      throw new TypeError(`${name} should return a array.`)
    }
  } else if (Array.isArray(obj)) {
    ret = obj
  }

  return ret
}

function getIp(original) {
  const current =
    Array.isArray(original) && original.length > 0
      ? original[original.length - 1]
      : original
  const ret = current.match(/\d+.\d+.\d+.\d+/)
  return ret ? ret[0] : ''
}

module.exports = {
  isMatch,
  getCookie,
  schemaCheck,
  ensureArray,
  getIp
}
