const uuid = require('uuid')

let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

// heroku config:set DATABASE_URL='mysql://b6261a0d2a1697:d02c226b@us-cdbr-east-06.cleardb.net/heroku_636a16cf97097d9?reconnect=true'

// for conncting from bash command
// mysql --host=us-cdbr-east-06.cleardb.net --user=b6261a0d2a1697 --password=d02c226b --reconnect heroku_636a16cf97097d9

// DATABASE_URL: mysql://b6261a0d2a1697:d02c226b@us-cdbr-east-06.cleardb.net/heroku_636a16cf97097d9?reconnect=true
const dbConfigProd = {
  HOST: 'us-cdbr-east-06.cleardb.net',
  USER: 'b6261a0d2a1697',
  PASSWORD: 'd02c226b',
  DB: 'heroku_636a16cf97097d9',
}

const dbConfigDev = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'movies',
}

const sessConfig = {
  genid: () => uuid.v4(),
  secret: 'I will Never GiveUp ! :boxing_glove:',
  resave: false,
  saveUninitialized: true,
  expires: expiryDate,
}
let dbConfig
if (process.env.NODE_ENV !== 'production') dbConfig = dbConfigDev
else dbConfig = dbConfigProd

module.exports = { dbConfig, sessConfig }
