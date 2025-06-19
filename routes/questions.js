const express = require('express')
const router = express.Router()
const {
  createQuestion,
  getQuestionsByQuiz,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questions')

router.route('/').post(createQuestion)
router.route('/quiz/:quizId').get(getQuestionsByQuiz)
router.route('/:id').patch(updateQuestion).delete(deleteQuestion)

module.exports = router
