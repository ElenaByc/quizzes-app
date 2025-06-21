const Quiz = require('../models/Quiz')
const { NotFoundError, UnauthenticatedError } = require('../errors')

const checkQuizAccess = async (quizId, userId, edit = false) => {
  const quiz = await Quiz.findById(quizId)
  if (!quiz) {
    throw new NotFoundError(`No quiz found with ID: ${quizId}`)
  }

  const isCreator = quiz.createdBy.toString() === userId

  if (edit && !isCreator) {
    throw new UnauthenticatedError('You are not allowed to edit this quiz')
  }

  if (!quiz.isPublished && !isCreator) {
    throw new UnauthenticatedError('You are not allowed to view this quiz')
  }

  return quiz // return it in case the controller needs quiz data
}

module.exports = checkQuizAccess
