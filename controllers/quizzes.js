const Quiz = require('../models/Quiz')
const checkQuizAccess = require('../utils/checkQuizAccess')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllPublishedQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({ isPublished: true }).sort('createdAt')
  res.status(StatusCodes.OK).json({ quizzes, count: quizzes.length })
}

const getQuizzesCreatedByUser = async (req, res) => {
  const quizzes = await Quiz.find({ createdBy: req.user.userId }).sort(
    'createdAt',
  )
  res.status(StatusCodes.OK).json({ quizzes, count: quizzes.length })
}

const getQuiz = async (req, res) => {
  const {
    user: { userId },
    params: { id: quizId },
  } = req
  const quiz = await Quiz.findOne({ _id: quizId, createdBy: userId })
  if (!quiz) {
    throw new NotFoundError(`No quiz found with ID: ${quizId}`)
  }
  res.status(StatusCodes.OK).json({ quiz })
}

const createQuiz = async (req, res) => {
  console.log('Creating quiz with data:', req.body)
  req.body.createdBy = req.user.userId
  const quiz = await Quiz.create(req.body)

  res.status(StatusCodes.CREATED).json({ quiz })
}

const updateQuiz = async (req, res) => {
  console.log('Updating quiz with data:', req.body)
  const {
    body: { title, subject },
    user: { userId },
    params: { id: quizId },
  } = req

  if (!title || !subject) {
    throw new BadRequestError('Title and subject cannot be empty')
  }

  console.log('Updating quiz with ID:', quizId, 'by user:', userId)
  console.log('title:', title, 'subject:', subject)
  // Check if the quiz exists and belongs to the user
  await checkQuizAccess(quizId, userId, true)

  const quiz = await Quiz.findOneAndUpdate(
    { _id: quizId, createdBy: userId },
    req.body,
    { new: true, runValidators: true },
  )
  if (!quiz) {
    throw new NotFoundError(`No quiz found with ID: ${quizId}`)
  }

  res.status(StatusCodes.OK).json({ quiz })
}

const deleteQuiz = async (req, res) => {
  const {
    user: { userId },
    params: { id: quizId },
  } = req

  const quiz = await Quiz.findOneAndDelete({ _id: quizId, createdBy: userId })
  if (!quiz) {
    throw new NotFoundError(`No quiz found with ID: ${quizId}`)
  }
  console.log('Deleting quiz with ID:', quizId, 'by user:', userId)
  res.status(StatusCodes.OK).json({ msg: 'Quiz deleted successfully' })
}

module.exports = {
  getAllPublishedQuizzes,
  getQuizzesCreatedByUser,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
}
