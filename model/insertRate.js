/* eslint-disable no-unused-vars */
const mysql = require('mysql')
const util = require('util')
const axios = require('axios')
const { dbConfig } = require('../helpers/config.js')

const db = mysql.createConnection(dbConfig)
global.query = util.promisify(db.query.bind(db))
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const rand1To5 = () => randomNumber(1, 5)
const moviesIds = async () => {
  let data = await axios.get(
    'https://yts.mx/api/v2/list_movies.json?order_by=asc&limit=10&sort_by=seeds&page=3'
  )
  return data.data.data.movies.map((movie) => movie.id)
}

// movie_id, user_id, rate
const rateTable = []

db.connect(async (err) => {
  if (err) return console.log(err)
  let usersIds = await query('SELECT id FROM users')
  usersIds = usersIds.map((userId) => userId.id)
  let movieid = await moviesIds()
  for (let i = 0; i < usersIds.length; i++) {
    for (let z = 0; z < movieid.length; z++) {
      // [movie_id, user_id, rate]

      rateTable.push([movieid[z], usersIds[i], rand1To5()])
    }
  }

  const queryString = `INSERT INTO movie(movie_id, user_id, rate) VALUES ?`

  db.query(queryString, [rateTable], (_err, result) => {
    if (_err) throw _err
    console.table(result)
  })
})
