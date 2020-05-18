// Routers handler
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  res.send('from localhost:3000/')
})

module.exports = router
