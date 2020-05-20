const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const createError = require('http-errors')
const cookie = require('cookie-parser')
const { errorHandler } = require('./helpers/error.js')
const { sessConfig } = require('./helpers/config.js')
const { hbsHelpers } = require('./helpers/handlebarHelpers.js')
const router = require('./routes/routes.js')

const app = express()

const hbs = exphbs.create({
  extname: '.hbs',
  helpers: hbsHelpers,
  partialsDir: path.join(__dirname, 'views/partials'),
})

app.set('port', process.env.PORT || 3000)

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(express.static(path.join(__dirname, './public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookie())

app.use(session(sessConfig))

app.use(router) // dont put routers here

if (process.env.NODE_ENV !== 'production') app.use(logger('dev'))

app.use((req, res, next) => {
  next(createError(404))
})
app.use(errorHandler)

module.exports = app
