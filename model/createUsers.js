/* eslint-disable no-await-in-loop */
const mysql = require('mysql')
const { dbConfig } = require('../helpers/config.js')
const { hashPassword } = require('../helpers/auth.js')

const db = mysql.createConnection(dbConfig)

// const createOneUser = async (i) => [
//   `fuser${i}`,
//   `luser${i}`,
//   `user${i}@gmail.com`,
//   await hashPassword('00000'),
// ]

const createAllUsers = async () => {
  let users = []

  for (let i = 0; i <= 50; i++)
    users.push([`fuser${i}`, `luser${i}`, `user${i}@gmail.com`, await hashPassword('00000')])

  // return Promise.all(users)
  return users
}

db.connect(async (err) => {
  if (err) throw err
  const newUsers = await createAllUsers()
  const queryString = `INSERT INTO users(firstname,lastname,email,password) VALUES ?`

  db.query(queryString, [newUsers], (_err, result) => {
    if (_err) throw _err
    console.table(result)
  })
})
