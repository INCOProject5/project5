const mysql = require('mysql')
const { dbConfig } = require('../helpers/config.js')

const db = mysql.createConnection(dbConfig)

const initDB = async () => {
  await db.query('CREATE DATABASE IF NOT EXISTS movies')
  await db.query('USE movies')
  await db.query(`CREATE TABLE IF NOT EXISTS users(
          id INT AUTO_INCREMENT,
          firstname VARCHAR(255) NOT NULL,
          lastname VARCHAR(255) NOT NULL,
          email VARCHAR(320) NOT NULL,
          password VARCHAR(256) NOT NULL,
          PRIMARY KEY(id)
          )`)
  await db.query(`
    CREATE TABLE IF NOT EXISTS movie(
                                    id INT AUTO_INCREMENT,
                                    movie_id INT,
                                    user_id INT,
                                    rate INT,
                                    PRIMARY KEY(id),
                                    FOREIGN KEY(user_id)
                                        REFERENCES users(id)
                                        ON DELETE CASCADE
                                    )`)
}

db.connect((err) => {
  if (err) return console.log(err)
  try {
    return initDB()
  } catch (error) {
    return console.log(error)
  }
})
