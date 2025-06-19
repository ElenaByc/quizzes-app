const express = require('express')
const router = express.Router()

const {
  getAllPublishedQuizzes,
  getQuizzesByCreator,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizzes')

router.route('/').post(createQuiz).get(getAllPublishedQuizzes)
router.route('/creator').get(getQuizzesByCreator)
router.route('/:id').get(getQuiz).patch(updateQuiz).delete(deleteQuiz)

module.exports = router
