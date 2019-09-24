

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (e, req, res, next) => {
  console.error(e.message)

  if (e.name === 'CastError' && e.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id'
    })
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message
    })
  } else if (e.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  }

  next(e)
}

const tokenExtractor = (req, res, next) => {
  req.token = getTokenFrom(req)
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}