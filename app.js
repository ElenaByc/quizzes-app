const express = require('express')
const app = express()
require('dotenv').config()
require('express-async-errors')

// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// connectDB
const connectDB = require('./db/connect')

const authenticateUser = require('./middleware/authentication')

// routers
const authRouter = require('./routes/auth')
const quizzesRouter = require('./routes/quizzes')
const questionsRouter = require('./routes/questions')
const optionsRouter = require('./routes/options')

app.use(express.static('public'))

app.get('/multiply', (req, res) => {
  const result = req.query.first * req.query.second

  if (isNaN(result)) {
    res.json({ result: 'NaN' })
  } else if (result == null) {
    res.json({ result: 'null' })
  } else {
    res.json({ result: result })
  }
})

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1) // trust first proxy for rate limiting

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use('/api/v1/auth', authRouter)
// Auth required for content creation and modification
app.use('/api/v1/quizzes', authenticateUser, quizzesRouter)
app.use('/api/v1/questions', authenticateUser, questionsRouter)
app.use('/api/v1/options', authenticateUser, optionsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI

// const start = async () => {
//   try {
//     await connectDB(MONGO_URI)
//     app.listen(port, () =>
//       console.log(`Server is listening on port ${port}...`),
//     )
//   } catch (error) {
//     console.log(error)
//   }
// }

const start = () => {
  try {
    require('./db/connect')(MONGO_URI)
    return app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    )
  } catch (error) {
    console.log(error)
  }
}

start()

module.exports = { app }
