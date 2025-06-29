const express = require('express')
const router = express.Router()

const {
  getAllPublishedQuizzes,
  getQuizForTaking,
  getQuizzesCreatedByUser,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizzes')

router.route('/').post(createQuiz).get(getAllPublishedQuizzes)
router.route('/user').get(getQuizzesCreatedByUser)
router.route('/:id').get(getQuiz).patch(updateQuiz).delete(deleteQuiz)
router.route('/take/:id').get(getQuizForTaking)

module.exports = router
