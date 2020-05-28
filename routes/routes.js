/* eslint-disable camelcase */

const express = require('express')
const axios = require('axios').default
const { movieGet, searchGet } = require('./movie')
const { getByMovieIdAndUserId, updateMovieRating, insertRate } = require('../model/model')

const { loginGet, loginPost, logoutGet, signupGet, signupPost } = require('./auth')

const router = express.Router()

const indexGet = async (req, res) => {
  if (req.query.page === undefined) return res.redirect('/?page=3')
  let { page } = req.query

  if (req.session && req.session.page === page) {
    // if session "movies"  exists
    if (req.session && req.session.movies && req.session.user)
      return res.render('index', { movies: req.session.movies, user: req.session.user })
    if (req.session && req.session.movies)
      return res.render('index', { movies: req.session.movies })
    // if sesion "movies" not exists then fetch data from api and save session
  }

  axios
    .get(`https://yts.mx/api/v2/list_movies.json?order_by=asc&limit=10&sort_by=seeds&page=${page}`)
    // .then((data) => res.send(data.data)) - use for debugging
    .then((data) => {
      // curly brackets around movies appends .movies to data.data.data
      let { movies } = data.data.data
      req.session.movies = movies
      req.session.page = page
      if (req.session.user) return res.render('index', { movies, user: req.session.user })

      res.render('index', { movies })
      // console.log(typeof data.data.data.movies) - check datatype
    })
    .catch((err) => console.log(err))
}
//

const ratingGet = async (req, res) => {
  res.redirect('/movie')
}

const ratingPost = async (req, res) => {
  try {
    const { user_id, movie_id, rate } = req.body
    if (req.session && req.session.user && user_id !== '') {
      console.log(`user here :${user_id}`)
      const checkIfuserRated = await getByMovieIdAndUserId(movie_id, user_id)
      if (checkIfuserRated.length > 0) await updateMovieRating(user_id, movie_id, rate)
      else await insertRate(user_id, movie_id, rate)
    }

    return res.redirect(`/movie/${movie_id}`)
  } catch (error) {
    res.render('login', { error })
  }
}

/**
 * ***************************************
 * ***************************************
 * ***************************************
 * ***************************************
 * ***************************************
 */

router.get('/', indexGet)
router.get('/movie/:id', movieGet)

router.get('/rating', ratingGet)
router.post('/rating', ratingPost)
router.get('/searchresults', searchGet)

// authentication
router.get('/login', loginGet)
router.post('/login', loginPost)

router.get('/signup', signupGet)
router.post('/signup', signupPost)

router.get('/logout', logoutGet)
// end authentication

module.exports = router
