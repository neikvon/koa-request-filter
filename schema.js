module.exports = {
  methods: {
    required: false,
    types: ['string', 'array']
  },
  include: {
    required: false,
    types: ['string', 'array']
  },
  exclude: {
    required: false,
    types: ['string', 'array']
  },
  error: {
    required: false,
    types: ['object'],
    children: {
      status: {
        required: true,
        types: ['number']
      },
      code: {
        required: true,
        types: ['string']
      }
    }
  },
  rules: {
    required: true,
    types: ['object'],
    children: {
      cookies: {
        _type: 'array',
        _types: {
          name: ['string', 'array'],
          include: ['function', 'array', 'regexp'],
          exclude: ['function', 'array', 'regexp']
        },
        required: false
      },
      headers: {
        _type: 'array',
        _types: {
          name: ['string', 'array'],
          include: ['function', 'array', 'regexp'],
          exclude: ['function', 'array', 'regexp']
        },
        required: false
      },
      ip: {
        required: false,
        types: ['object'],
        children: {
          include: {
            required: false,
            types: ['function', 'array']
          },
          exclude: {
            required: false,
            types: ['function', 'array']
          }
        }
      }
    }
  }
}
