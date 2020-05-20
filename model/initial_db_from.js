const mysql = require('mysql')
const { dbConfig } = require('../helpers/config.js')

const db = mysql.createConnection(dbConfig)

const DBNAME = 'movies'
const createDB = `CREATE DATABASE IF NOT EXISTS ${DBNAME}`
const useDB = `USE ${DBNAME}`

const queryStrUserTable = `CREATE TABLE IF NOT EXISTS users(
                                id INT AUTO_INCREMENT,
                                firstname VARCHAR(255) NOT NULL,
                                lastname VARCHAR(255) NOT NULL,
                                email VARCHAR(320) NOT NULL,
                                password VARCHAR(256) NOT NULL,
                                PRIMARY KEY(id))`

const queryStrMovieTable = `CREATE TABLE IF NOT EXISTS movie(
                                id INT AUTO_INCREMENT,
                                movie_id INT,
                                user_id INT,
                                rate INT,
                                PRIMARY KEY(id),
                                FOREIGN KEY(user_id)
                                REFERENCES users(id)
                                ON DELETE CASCADE)`

db.connect((err) => {
  if (err) return console.log(err)

  db.query(createDB, (_err) => {
    if (_err) throw _err
  })
  db.query(useDB, (_err) => {
    if (_err) throw _err
  })
  db.query(queryStrUserTable, (_err) => {
    if (_err) throw _err
  })
  db.query(queryStrMovieTable, (_err) => {
    if (_err) throw _err
  })
  return console.log('database and tables created')
})
