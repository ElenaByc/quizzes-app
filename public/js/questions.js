import {
  inputEnabled,
  enableInput,
  clearMessage,
  setMessage,
  isMessageEmpty,
  getToken,
  setToken,
  setActiveDiv,
} from './index.js'
import { showLoginRegister } from './loginRegister.js'
import { showQuizManagement } from './quizzes.js'
import { showAddEditQuestion } from './addEditQuestion.js'
import { showOptionsForQuestion } from './options.js'

let questionsDiv = null

export const handleQuestions = () => {
  questionsDiv = document.getElementById('questions')

  questionsDiv.addEventListener('click', async (e) => {
    if (!inputEnabled) return

    const addBtn = e.target.closest('#add-question')
    const backBtn = e.target.closest('#back-to-quizzes')
    const editBtn = e.target.closest('.edit-question-button')
    const deleteBtn = e.target.closest('.delete-question-button')
    const optionsBtn = e.target.closest('.question-options-button')

    if (addBtn) {
      const quizId = document.getElementById('question-quiz-id')?.value
      showAddEditQuestion(null, quizId)
    } else if (backBtn) {
      clearMessage()
      showQuizManagement()
    } else if (optionsBtn) {
      const questionId = optionsBtn.dataset.id
      clearMessage()
      showOptionsForQuestion(questionId)
    } else if (editBtn) {
      const questionId = editBtn.dataset.id
      const quizId = document.getElementById('question-quiz-id')?.value
      clearMessage()
      showAddEditQuestion(questionId, quizId)
    } else if (deleteBtn) {
      enableInput(false) // Disable input during the operation
      const questionId = deleteBtn.dataset.id
      const quizId = document.getElementById('question-quiz-id')?.value

      try {
        const token = getToken()
        const response = await fetch(`/api/v1/questions/${questionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (response.status === 200) {
          setMessage(data.msg || 'Question deleted.')
          showQuizQuestions(quizId)
        } else {
          setMessage(data.msg || 'Failed to delete question.')
        }
      } catch (err) {
        console.error(err)
        setMessage(
          'A communication error occurred while deleting the question.',
        )
      } finally {
        enableInput(true)
      }
    }
  })
}

// Displays all questions for a specific quiz
export const showQuizQuestions = async (quizId) => {
  enableInput(false)
  setActiveDiv(questionsDiv)
  // set quizId in the hidden input field for adding/editing questions
  document.getElementById('question-quiz-id').value = quizId

  try {
    const token = getToken()
    const response = await fetch(`/api/v1/questions/quiz/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.status === 200) {
      if (data.quiz && data.quiz.title) {
        document.getElementById('questions-quiz-title').textContent =
          data.quiz.title
      }

      const questionListDiv = document.getElementById('questions-list')
      questionListDiv.innerHTML = '' // Clear previous content

      data.questions.forEach((question) => {
        const card = document.createElement('div')
        card.className =
          'card mb-3 p-3 d-flex flex-row align-items-center justify-content-between gap-3'

        const left = document.createElement('div')
        left.className = 'text-start'
        left.style.maxWidth = '60%'
        left.innerHTML = `<h4>${question.questionText}</h4>`

        const right = document.createElement('div')
        right.className =
          'd-flex align-items-center gap-3 flex-nowrap justify-content-end'

        // Plain text type label
        const typeText = document.createElement('div')
        typeText.className = 'text-center'
        typeText.style.width = '130px'
        typeText.textContent =
          question.type === 'multiple_choice'
            ? 'Multiple Choice'
            : 'Single Choice'

        const optionsButton = document.createElement('button')
        optionsButton.className =
          'btn btn-outline-secondary question-options-button'
        optionsButton.innerHTML = `<i class="fa fa-list"></i>&nbsp;&nbsp;Answer Options`
        optionsButton.dataset.id = question._id

        const editButton = document.createElement('button')
        editButton.className = 'btn btn-outline-secondary edit-question-button'
        editButton.innerHTML = `<i class="fa fa-pencil"></i>&nbsp;&nbsp;Edit Question`
        editButton.dataset.id = question._id

        const deleteButton = document.createElement('button')
        deleteButton.className = 'btn btn-outline-danger delete-question-button'
        deleteButton.innerHTML = `<i class="fa fa-trash"></i>&nbsp;&nbsp;Delete`
        deleteButton.dataset.id = question._id

        right.append(typeText, optionsButton, editButton, deleteButton)
        card.append(left, right)
        questionListDiv.appendChild(card)
      })
      if (isMessageEmpty()) {
        setMessage(`Loaded ${data.questions.length} questions.`)
      }
    } else if (response.status === 401) {
      setMessage('Authentication failed. Please log in again.')
      setToken(null)
      showLoginRegister()
    } else {
      setMessage(data.msg || 'Failed to load questions.')
    }
  } catch (err) {
    console.error(err)
    setMessage('A communication error occurred while loading questions.')
  } finally {
    enableInput(true)
  }
}
