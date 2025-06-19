const express = require('express')
const router = express.Router()

const {
  getAllQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizzes')

router.route('/').post(createQuiz).get(getAllQuizzes)
router.route('/:id').get(getQuiz).patch(updateQuiz).delete(deleteQuiz)

module.exports = router
