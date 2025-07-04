const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the quiz'],
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    subject: {
      type: String,
      enum: [
        'Math',
        'Astronomy',
        'Physics',
        'Chemistry',
        'Biology',
        'History',
        'Literature',
        'Geography',
        'Music',
        'Other',
      ],
      required: [true, 'Please select a subject for the quiz'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the creator of the quiz'],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Quiz', QuizSchema)
