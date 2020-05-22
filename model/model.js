const createError = require('http-errors')
const { hashPassword, comparePassword } = require('../helpers/auth')

const getUserById = async (userID) =>
  query(`SELECT id,firstname,lastname,email FROM users WHERE id=?`, [userID])

const getUserByEmailAndPass = async (email, password) => {
  const user = await query(`SELECT * FROM users where email=?`, [email])
  if (user.length <= 0) throw createError(401, 'invalid email or password ')
  if (comparePassword(password, user[0].password)) return user
  throw createError(401, 'something went wrong')
}

const signup = async (user) => {
  let { email, firstName, lastName, password, confirmPassword } = user
  let trimStr = (str) => String(str).trim()

  if (!firstName || !lastName || !password || !email)
    throw createError(400, 'all Fields are required')
  firstName = trimStr(firstName)
  lastName = trimStr(lastName)
  email = trimStr(email)
  if (password !== confirmPassword) throw createError(400, 'Passwords do not match.')

  const result = await query('SELECT id FROM users WHERE email = ?', [email])

  if (result.length > 0) throw createError(409, 'user already exists')

  const hashedPassword = await hashPassword(password)

  return query('INSERT INTO users(firstname, lastname, email, password) VALUES (?, ?, ?, ?)', [
    firstName,
    lastName,
    email,
    hashedPassword,
  ])
}

const getRatesByMovieId = async (id) => query(`SELECT rate FROM movie WHERE movie_id=?`, id)
const getMovieByUserId = async (id) => query(`SELECT * FROM movie WHERE user_id=?`, id)
const getByMovieIdAndUserId = async (mId, uId) =>
  query(`SELECT * FROM movie WHERE user_id=? AND movie_id=?`, [mId, uId])

module.exports = {
  getUserByEmailAndPass,
  signup,
  getUserById,
}
