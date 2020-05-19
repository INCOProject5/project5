const mysql = require('mysql')
const { hashSync } = require('bcryptjs')
const { dbConfig } = require('../helpers/config.js')

const db = mysql.createConnection(dbConfig)
const hashed = hashSync('00000', 8)

db.connect((err) => {
  if (err) throw err

  for (let i = 0; i <= 50; i++) {
    db.query('INSERT INTO users SET ?', {
      firstname: `fuser${i}`,
      lastname: `luser${i}`,
      email: `user${i}@gmail.com`,
      password: hashed,
    })
  }

  console.log('done')
})
