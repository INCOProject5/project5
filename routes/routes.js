/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express')
const axios = require('axios').default
const {
  getUserByEmailAndPass,
  getRatesByMovieId,
  signup,
  getMovieByUserId,
  getByMovieIdAndUserId,
  updateMovieRating,
  insertRate,
} = require('../model/model')
const { average } = require('../helpers/utils')

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
const movieGet = async (req, res) => {
  let averageResult
  try {
    const { id } = req.params

    const rate = await getRatesByMovieId(id)

    let movieBy = {}

    if (req.session.user) {
      movieBy = await getByMovieIdAndUserId(id, req.session.user.id)
    }

    if (rate.length > 0) averageResult = average(rate.map((each) => each.rate)).toFixed(1)
    else averageResult = 0

    if (req.session && req.session.movies) {
      let sessionData = req.session.movies
      let movie = sessionData.find((eachMovie) => eachMovie.id == id)
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
    axios
      .get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
      .then((data) => {
        let { movie } = data.data.data
        if (req.session.user)
          return res.render('movie', {
            movie,
            user: req.session.user,
            averageResult,
            total: rate.length,
            myRating: movieBy.map((each) => each.rate),
          })

        res.render('movie', { movie, averageResult, total: rate.length })
      })
      .catch((err) => console.log(err))
  } catch (error) {
    console.log(error)
  }
}

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

const searchGet = async (req, res) => {
  let url = `https://yts.mx/api/v2/list_movies.json?`
  // if (req.query.genre !== null && req.query.title !== null) {
  //   url = `${url}genre=${req.query.genre}&query_term=${req.query.title}`
  // } else if (req.query.title !== null && req.query.title !== undefined) {
  //   url = `${url}query_term=${req.query.title}`
  // } else {
  //   url = `${url}genre=${req.query.genre}`
  // }

  if (req.query.genre !== null && req.query.genre !== undefined) url = `${url}genre=${req.query.genre}`
  if (req.query.title !== null && req.query.title !== undefined) url = `${url}query_term=${req.query.title}`
  // (req.query.genre !== null && req.query.genre !== undefined)
  // https://yts.mx/api/v2/list_movies.json?genre=drama&query_term=women
  console.log(url)
  await axios
    .get(url)
    .then((data) => {
      let { movies } = data.data.data
      req.session.movies = movies
      if(req.session && req.session.user)  return res.render('search', { movies,user: req.session.user})
      res.render('search', { movies })
    })
    .catch((err) => {
      console.log(err)
    })
}
/**
 * ***************************************
 * ***************************************
 * ***************************************
 * ***************************************
 * ***************************************
 */

const loginGet = (req, res) => {
  if (req.session.user) return res.redirect('/')
  return res.render('login', { data: '' })
}

const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await getUserByEmailAndPass(email, password)

    req.session.user = { email, id: user[0].id, firstname: user[0].firstname } // set session

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
