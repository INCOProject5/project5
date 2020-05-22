/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express')
const axios = require('axios').default
const { getUserByEmailAndPass } = require('../model/model')
const { signup } = require('../model/model')

const router = express.Router()

const indexGet = async (req, res) => {
  // if session "movies"  exists
  if (req.session && req.session.movies) return res.render('index', { movies: req.session.movies })

  // if sesion "movies" not exists then fetch data from api and save session
  axios
    .get('https://yts.mx/api/v2/list_movies.json?order_by=asc&limit=6&sort_by=seeds&page=3')
    // .then((data) => res.send(data.data)) - use for debugging
    .then((data) => {
      // curly brackets around movies appends .movies to data.data.data
      let { movies } = data.data.data
      req.session.movies = movies
      res.render('index', { movies })
      // console.log(typeof data.data.data.movies) - check datatype
    })
    .catch((err) => console.log(err))
}

const movieGet = async (req, res) => {
  const { id } = req.params

  if (req.session && req.session.movies) {
    let sessionData = req.session.movies
    let movie = sessionData.find((eachMovie) => eachMovie.id == id)

    return res.render('movie', { movie })
  }
  axios
    .get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    .then((data) => {
      let { movie } = data.data.data
      res.render('movie', { movie })
    })
    .catch((err) => console.log(err))
}

const ratingPost = async (req, res) => {
  const { user_id, movie_id, rate } = req.body

  res.json({ newdata: 'data from server' })
}

const loginGet = (req, res) => {
  if (req.session.user) return res.redirect('/')
  return res.render('login', { data: '' })
}

const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await getUserByEmailAndPass(email, password)

    req.session.user = { email, id: user[0].id } // set session

    res.redirect('/')
  } catch (error) {
    res.render('login', { error })
  }
}

const logoutGet = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err)
    }
    return res.redirect('/login')
  })
}

const signupGet = async (req, res) => {
  res.render('signup')
}
const signupPost = async (req, res) => {
  try {
    await signup(req.body)
    res.redirect('/login')
  } catch (error) {
    res.render('signup', { error })
  }
}

router.get('/', indexGet)
router.get('/movie/:id', movieGet)
router.post('/rating', ratingPost)

// authentication
router.get('/login', loginGet)
router.post('/login', loginPost)

router.get('/signup', signupGet)
router.post('/signup', signupPost)

router.get('/logout', logoutGet)
// end authentication

module.exports = router
