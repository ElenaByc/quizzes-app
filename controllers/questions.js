const Question = require('../models/Question')
const Option = require('../models/Option')
const checkQuizAccess = require('../utils/checkQuizAccess')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const allowedTypes = ['single_choice', 'multiple_choice']

// Create a new question for a quiz
const createQuestion = async (req, res) => {
  const { quizId, questionText, type } = req.body
  console.log('Creating question with data:', req.body)

  if (!quizId || !questionText) {
    throw new BadRequestError('Quiz ID, and question text are required')
  }

  if (type && !allowedTypes.includes(type)) {
    throw new BadRequestError(`Invalid question type: ${type}`)
  }

  const question = await Question.create(req.body)
  res.status(StatusCodes.CREATED).json({ question })
}

// Get all questions for a specific quiz
const getQuestionsByQuiz = async (req, res) => {
  const { quizId } = req.params

  // Check if the user has access to the quiz
  const quiz = await checkQuizAccess(quizId, req.user.userId)
  const questions = await Question.find({ quizId })

  res.status(StatusCodes.OK).json({
    quiz: { id: quizId, title: quiz.title },
    questions,
    count: questions.length,
  })
}

// Get a specific question by ID
const getQuestionById = async (req, res) => {
  const { id: questionId } = req.params

  const question = await Question.findById(questionId)
  if (!question) {
    throw new NotFoundError(`No question found with ID: ${questionId}`)
  }

  // Check if the user has access to the quiz associated with the question
  await checkQuizAccess(question.quizId, req.user.userId)

  res.status(StatusCodes.OK).json({ question })
}

// Update a specific question
const updateQuestion = async (req, res) => {
  const { id: questionId } = req.params
  const { type } = req.body

  const question = await Question.findById(questionId)
  if (!question) {
    throw new NotFoundError(`No question found with ID: ${questionId}`)
  }

  if (type && !allowedTypes.includes(type)) {
    throw new BadRequestError(`Invalid question type: ${type}`)
  }

  // Check if the user has editing access to the quiz associated with the question
  await checkQuizAccess(question.quizId, req.user.userId, true)

  const updatedQuestion = await Question.findByIdAndUpdate(
    questionId,
    req.body,
    { new: true, runValidators: true },
  )

  res.status(StatusCodes.OK).json({ question: updatedQuestion })
}

// Delete a specific question
const deleteQuestion = async (req, res) => {
  const { id: questionId } = req.params

  // Check if the question exists
  const question = await Question.findById(questionId)
  if (!question) {
    throw new NotFoundError(`No question found with ID: ${questionId}`)
  }

  // Check if the user has editing access to the quiz associated with the question
  await checkQuizAccess(question.quizId, req.user.userId, true)

  // Get questions options
  const options = await Option.find({ questionId })
  if (options.length > 0) {
    // Delete associated options
    await Option.deleteMany({ questionId })
  }

  // Delete the question
  await Question.findByIdAndDelete(questionId)

  res.status(StatusCodes.OK).json({ msg: 'Question deleted successfully' })
}

module.exports = {
  createQuestion,
  getQuestionsByQuiz,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
}
