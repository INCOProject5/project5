const { compare, hash } = require('bcryptjs')
const createError = require('http-errors')

const hashPassword = async (password) => hash(password, 8)
const comparePassword = async (requestPassword, passwordInDbB) =>
  compare(requestPassword, passwordInDbB)

const routeProtector = (req, res, next) => {
  if (req.session && req.session.user) return next()
  throw createError(403, 'Forbidden')
}

module.exports = {
  hashPassword,
  comparePassword,
  routeProtector,
}
