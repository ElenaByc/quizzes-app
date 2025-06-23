const Quiz = require('../models/Quiz')
const Question = require('../models/Question')
const Option = require('../models/Option')
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
  console.log('Creating quiz with data:', req.body, 'by user:', req.user.userId)

  const {
    body: { title, subject, description },
    user: { userId },
  } = req

  if (!title || !subject) {
    throw new BadRequestError('Title and subject cannot be empty')
  }

  // `isPublished` is intentionally excluded during quiz creation.
  // Publishing must go through the update flow, where validation is enforced.
  const quiz = await Quiz.create({
    title,
    subject,
    description,
    createdBy: userId,
  })

  res.status(StatusCodes.CREATED).json({ quiz })
}

const updateQuiz = async (req, res) => {
  console.log('Updating quiz with data:', req.body)

  const {
    body: { title, subject, description, isPublished },
    user: { userId },
    params: { id: quizId },
  } = req

  if (!title || !subject) {
    throw new BadRequestError('Title and subject cannot be empty')
  }

  // Check if the quiz exists and belongs to the user
  let quiz = await checkQuizAccess(quizId, userId, true)

  // Validate the quiz structure if user is trying to publish the quiz
  if (quiz.isPublished === false && isPublished === true) {
    const questions = await Question.find({ quizId })
    if (questions.length === 0) {
      throw new BadRequestError('Cannot publish a quiz with no questions')
    }

    for (const question of questions) {
      const options = await Option.find({ questionId: question._id })

      if (options.length < 2) {
        throw new BadRequestError(
          `Question "${question.questionText}" must have at least two options`,
        )
      }

      const correctOptions = options.filter((o) => o.isCorrect)

      if (correctOptions.length === 0) {
        throw new BadRequestError(
          `Question "${question.questionText}" has no correct option`,
        )
      }

      if (question.type === 'single_choice' && correctOptions.length > 1) {
        throw new BadRequestError(
          `Question "${question.questionText}" is single-choice but has multiple correct options`,
        )
      }
    }
  }

  quiz = await Quiz.findOneAndUpdate(
    { _id: quizId, createdBy: userId },
    { title, subject, description, isPublished },
    { new: true, runValidators: true },
  )

  res.status(StatusCodes.OK).json({ quiz })
}

const deleteQuiz = async (req, res) => {
  const {
    user: { userId },
    params: { id: quizId },
  } = req

  // Check if the quiz exists and belongs to the user
  await checkQuizAccess(quizId, userId, true)

  // Check if quiz has any associated questions
  const questions = await Question.find({ quizId })
  if (questions.length > 0) {
    // Loop through each question and delete its options
    for (const question of questions) {
      await Option.deleteMany({ questionId: question._id })
    }
    // Now delete the questions themselves
    await Question.deleteMany({ quizId })
  }

  // Finally, delete the quiz
  console.log('Deleting quiz with ID:', quizId, 'by user:', userId)
  await Quiz.findOneAndDelete({ _id: quizId, createdBy: userId })
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
