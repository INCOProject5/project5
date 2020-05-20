const express = require('express')
const axios = require('axios').default
const { getUserByEmailAndPass } = require('../model/model')
const { signup } = require('../model/model')

const router = express.Router()

const indexGet = async (req, res) => {
  axios
    .get('https://yts.mx/api/v2/list_movies.json?order_by=asc&limit=5&sort_by=seeds&page=2')
    // .then((data) => res.send(data.data)) - use for debugging
    .then((data) => {
      // curly brackets around movies appends .movies to data.data.data
      let { movies } = data.data.data
      res.render('index', { movies })
      // console.log(typeof data.data.data.movies) - check datatype
    })
    .catch((err) => console.log(err))
}

const movieGet = async (req, res) => {
  const { id } = req.params
  // console.log({ id })
  axios
    .get(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    .then((data) => {
      let { movie } = data.data.data
      // res.render('movie', { movie })
      res.render('movie', { movie })
    })
    .catch((err) => console.log(err))
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

// authentication
router.get('/login', loginGet)
router.post('/login', loginPost)

router.get('/signup', signupGet)
router.post('/signup', signupPost)

router.get('/logout', logoutGet)
// end authentication

module.exports = router
