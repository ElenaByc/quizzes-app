const express = require('express')
const router = express.Router()
const {
  createOption,
  updateOption,
  deleteOption,
  getOptionsByQuestion,
  getOptionById,
} = require('../controllers/options')

router.route('/').post(createOption)
router.route('/:id').get(getOptionById).patch(updateOption).delete(deleteOption)
router.route('/question/:questionId').get(getOptionsByQuestion)

module.exports = router
