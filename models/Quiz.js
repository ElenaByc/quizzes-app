const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the quiz'],
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    optional: true,
    maxlength: 500,
  },
  subject: {
    type: String,
    enum: ['Math', 'Science', 'History', 'Literature', 'Geography', 'Other'],
    required: [true, 'Please select a subject for the quiz'],
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      options: [
        {
          optionText: {
            type: String,
            required: true,
          },
          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the creator of the quiz'],
  },
}, { timestamps: true })

module.exports = mongoose.model('Quiz', QuizSchema)
