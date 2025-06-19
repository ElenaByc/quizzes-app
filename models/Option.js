const mongoose = require('mongoose')

const OptionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    optionText: {
      type: String,
      required: [true, 'Please provide the answer option text'],
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Option', OptionSchema)
