const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Please provide the question text'],
    },
    type: {
      type: String,
      enum: ['single_choice', 'multiple_choice'],
      default: 'single_choice',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Question', QuestionSchema)
