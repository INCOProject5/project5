const mysql = require('mysql')
const http = require('http')
const util = require('util')
const app = require('./app')
const { onError, onListen } = require('./helpers/error.js')
const { dbConfig } = require('./helpers/config.js')

const db = mysql.createConnection(dbConfig)

db.connect((_err) => {
  if (_err) console.log('Error connecting to Database')

  global.query = util.promisify(db.query.bind(db)) // binding necessary as the mysql module uses the context

  const server = http.createServer(app)

  server.listen(app.get('port'))

  server.on('error', (er) => onError(er, app))
  server.on('listening', onListen.bind(server))

  console.log(`DB connected `)
})
