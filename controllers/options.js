const Option = require('../models/Option')
const Question = require('../models/Question')
const checkQuizAccess = require('../utils/checkQuizAccess')

const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

// Create a new option for a question
const createOption = async (req, res) => {
  console.log('Creating option:', req.body)
  const { questionId, optionText } = req.body

  if (!questionId || !optionText) {
    throw new BadRequestError('Question ID and option text are required')
  }

  const option = await Option.create(req.body)
  res.status(StatusCodes.CREATED).json({ option })
}

// Get all options for a specific question
const getOptionsByQuestion = async (req, res) => {
  const { questionId } = req.params
  const question = await Question.findById(questionId)
  if (!question) {
    throw new NotFoundError(`No question found with ID: ${questionId}`)
  }
  // Check if the user has access to the quiz associated with the question
  await checkQuizAccess(question.quizId, req.user.userId)

  const options = await Option.find({ questionId })

  res.status(StatusCodes.OK).json({ options, count: options.length })
}

// Get a specific answer option by ID
const getOptionById = async (req, res) => {
  const { id: optionId } = req.params

  const option = await Option.findById(optionId)
  if (!option) {
    throw new NotFoundError(`No option found with ID: ${optionId}`)
  }

  const question = await Question.findById(option.questionId)
  if (!question) {
    throw new NotFoundError(`Parent question not found for this option`)
  }

  // Check if the user has access to the quiz associated with the question
  await checkQuizAccess(question.quizId, req.user.userId)

  res.status(StatusCodes.OK).json({ option })
}

// Update a specific option
const updateOption = async (req, res) => {
  const { id: optionId } = req.params
  const option = await Option.findById(optionId)
  if (!option) {
    throw new NotFoundError(`No option found with ID: ${optionId}`)
  }

  const question = await Question.findById(option.questionId)
  if (!question) {
    throw new NotFoundError(`Parent question not found for this option`)
  }

  await checkQuizAccess(question.quizId, req.user.userId, true) // enforce ownership

  const updated = await Option.findByIdAndUpdate(optionId, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(StatusCodes.OK).json({ option: updated })
}

// Delete a specific option
const deleteOption = async (req, res) => {
  const { id: optionId } = req.params
  const option = await Option.findById(optionId)
  if (!option) {
    throw new NotFoundError(`No option found with ID: ${optionId}`)
  }

  const question = await Question.findById(option.questionId)
  if (!question) {
    throw new NotFoundError(`Parent question not found for this option`)
  }

  await checkQuizAccess(question.quizId, req.user.userId, true) // <-- enforce ownership

  await option.deleteOne()
  res.status(StatusCodes.OK).json({ msg: 'Option deleted successfully' })
}

module.exports = {
  createOption,
  updateOption,
  deleteOption,
  getOptionsByQuestion,
  getOptionById,
}
