import {
  inputEnabled,
  enableInput,
  clearMessage,
  setMessage,
  getToken,
  setActiveDiv,
} from './index.js'
import { showQuizQuestions } from './questions.js'

let addEditQuestionDiv = null
let addEditQuestionForm = null
let questionText = null
let questionType = null
let questionQuizId = null
let submitQuestionButton = null

export const handleAddEditQuestion = () => {
  addEditQuestionDiv = document.getElementById('edit-question')
  addEditQuestionForm = document.getElementById('edit-question-form')
  questionText = document.getElementById('question-text')
  questionType = document.getElementById('question-type')
  questionQuizId = document.getElementById('question-quiz-id')
  submitQuestionButton = document.getElementById('submit-question')
  const cancelEditButton = document.getElementById('cancel-edit-question')

  addEditQuestionForm.onsubmit = (e) => {
    e.preventDefault()
    if (!inputEnabled) return
    submitQuestionButton.click()
  }

  addEditQuestionDiv.addEventListener('click', async (e) => {
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === submitQuestionButton) {
        enableInput(false)

        const quizId = questionQuizId.value
        let method = 'POST'
        let url = '/api/v1/questions'
        let successMessage = 'New question was created.'

        const selectedType = addEditQuestionForm.querySelector(
          'input[name="questionType"]:checked',
        )?.value

        const payload = {
          quizId,
          questionText: questionText.value,
          type: selectedType,
        }

        if (
          submitQuestionButton.textContent === 'Update Question' &&
          addEditQuestionDiv.dataset.id
        ) {
          const questionId = addEditQuestionDiv.dataset.id
          method = 'PATCH'
          url = `/api/v1/questions/${questionId}`
          successMessage = 'The question was updated.'
        }

        try {
          const token = getToken()
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          })

          const data = await response.json()

          if (response.status === 201 || response.status === 200) {
            setMessage(successMessage)
            clearAddEditQuestionForm()
            showQuizQuestions(quizId)
          } else {
            setMessage(data.msg || 'Failed to save question.')
          }
        } catch (err) {
          console.error(err)
          setMessage(
            'A communication error occurred while saving the question.',
          )
        } finally {
          enableInput(true)
        }
      } else if (e.target === cancelEditButton) {
        const quizId = questionQuizId.value
        clearAddEditQuestionForm()
        setMessage('Question editing cancelled.')
        showQuizQuestions(quizId)
      }
    }
  })
}

export const showAddEditQuestion = async (questionId, quizId) => {
  clearMessage()
  const formTitle = document.getElementById('edit-question-title')
  submitQuestionButton.textContent = 'Add New Question'
  formTitle.textContent = 'Create New Question'
  clearAddEditQuestionForm()
  questionQuizId.value = quizId
  addEditQuestionDiv.dataset.id = ''

  if (!questionId) {
    setActiveDiv(addEditQuestionDiv)
  } else {
    enableInput(false)
    try {
      const token = getToken()
      const response = await fetch(`/api/v1/questions/${questionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.status === 200) {
        questionText.value = data.question.questionText
        const typeRadio = addEditQuestionForm.querySelector(
          `input[name="questionType"][value="${data.question.type}"]`,
        )
        if (typeRadio) {
          typeRadio.checked = true
        }
        questionQuizId.value = data.question.quizId
        addEditQuestionDiv.dataset.id = questionId

        submitQuestionButton.textContent = 'Update Question'
        formTitle.textContent = 'Edit Question'
        setActiveDiv(addEditQuestionDiv)
      } else {
        setMessage(data.msg || 'The question could not be found.')
        showQuizQuestions(quizId)
      }
    } catch (err) {
      console.error(err)
      setMessage('A communication error occurred while loading the question.')
      showQuizQuestions(quizId)
    } finally {
      enableInput(true)
    }
  }
}

export const clearAddEditQuestionForm = () => {
  questionText.value = ''
  questionQuizId.value = ''

  const singleChoiceRadio = addEditQuestionForm.querySelector(
    'input[name="questionType"][value="single_choice"]',
  )
  if (singleChoiceRadio) singleChoiceRadio.checked = true
}
