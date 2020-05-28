const axios = require('axios').default
const { average } = require('../helpers/utils')
const {
  getRatesByMovieId,

  getByMovieIdAndUserId,
} = require('../model/model')

const movieGet = async (req, res) => {
  let averageResult
  try {
    let movieBy = {}
    const { id } = req.params
    const rate = await getRatesByMovieId(id)

    if (req.session.user) movieBy = await getByMovieIdAndUserId(id, req.session.user.id)

    if (rate.length > 0) averageResult = average(rate.map((each) => each.rate)).toFixed(1)
    else averageResult = 0

    if (req.session && req.session.movies) {
      let sessionData = req.session.movies
      let movie = sessionData.find((eachMovie) => eachMovie.id === id)
      if (movie !== undefined && movie.length > 0) {
        if (req.session.user)
          return res.render('movie', {
            movie,
            user: req.session.user,
            averageResult,
            total: rate.length,
            myRating: movieBy.map((each) => each.rate)[0],
            specialChars: '& < > " \' ` =',
          })
        return res.render('movie', { movie, averageResult, total: rate.length })
      }
    }
    axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`).then((data) => {
      let { movie } = data.data.data
      if (req.session.user)
        return res.render('movie', {
          movie,
          user: req.session.user,
          averageResult,
          total: rate.length,
          myRating: movieBy.map((each) => each.rate)[0],
        })
      if (req.session.user)
        return res.render('movie', {
          movie,
          user: req.session.user,
          averageResult,
          total: rate.length,
          myRating: movieBy.map((each) => each.rate)[0],
          specialChars: '& < > " \' ` =',
        })
      res.render('movie', { movie, averageResult, total: rate.length })
    })
  } catch (error) {
    console.log(error)
  }
}

const searchGet = async (req, res) => {
  let url = `https://yts.mx/api/v2/list_movies.json?`

  if (req.query.genre !== null && req.query.genre !== undefined)
    url = `${url}genre=${req.query.genre}`
  if (req.query.title !== null && req.query.title !== undefined)
    url = `${url}query_term=${req.query.title}`

  await axios
    .get(url)
    .then((data) => {
      let { movies } = data.data.data
      req.session.movies = movies
      if (req.session && req.session.user)
        return res.render('search', { movies, user: req.session.user })
      res.render('search', { movies })
    })
    .catch((err) => {
      console.log(err)
    })
}

module.exports = { movieGet, searchGet }
