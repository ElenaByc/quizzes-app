const Question = require('../models/Question')
const checkQuizAccess = require('../utils/checkQuizAccess')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

// Create a new question for a quiz
const createQuestion = async (req, res) => {
  const { quizId, questionText, type } = req.body

  if (!quizId || !questionText || !type) {
    throw new BadRequestError('Quiz ID, question text, and type are required')
  }

  const question = await Question.create(req.body)
  res.status(StatusCodes.CREATED).json({ question })
}

// Get all questions for a specific quiz
const getQuestionsByQuiz = async (req, res) => {
  const { quizId } = req.params
  // Check if the user has access to the quiz
  await checkQuizAccess(quizId, req.user.userId)
  const questions = await Question.find({ quizId })

  res.status(StatusCodes.OK).json({ questions, count: questions.length })
}

// Update a specific question
const Question = require('../models/Question')
const checkQuizAccess = require('../utils/checkQuizAccess')

const updateQuestion = async (req, res) => {
  const { id: questionId } = req.params
  const question = await Question.findById(questionId)
  if (!question) {
    throw new NotFoundError(`No question found with ID: ${questionId}`)
  }

  await checkQuizAccess(question.quizId, req.user.userId, true) // enforce ownership

  const updated = await Question.findByIdAndUpdate(questionId, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(StatusCodes.OK).json({ question: updated })
}

// Delete a specific question
const deleteQuestion = async (req, res) => {
  const { id: questionId } = req.params
  const question = await Question.findByIdAndDelete(questionId)

  if (!question) {
    throw new NotFoundError(`No question found with ID: ${questionId}`)
  }

  await checkQuizAccess(question.quizId, req.user.userId, true) // enforce ownership

  res.status(StatusCodes.OK).json({ msg: 'Question deleted successfully' })
}

module.exports = {
  createQuestion,
  getQuestionsByQuiz,
  updateQuestion,
  deleteQuestion,
}
