const onError = (error, app) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string' ? `Pipe ${app.get('port')}` : `Port ${app.get('port')}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListen() {
  let addr = this.address()
  let bind = typeof addr === 'string' ? `pipe ${addr}` : `http://localhost:${addr.port}`
  console.log(`Server Listening on ${bind}`)
}

// error handler
const errorHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error', { error: err })
}

module.exports = { onError, onListen, errorHandler }
