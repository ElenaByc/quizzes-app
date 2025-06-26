import {
  inputEnabled,
  enableInput,
  clearMessage,
  setMessage,
  isMessageEmpty,
  getToken,
  setActiveDiv,
} from './index.js'

import { showQuizQuestions } from './questions.js'
import { showAddEditOption } from './addEditOption.js'

let optionsDiv = null

export const handleOptions = () => {
  optionsDiv = document.getElementById('options')

  optionsDiv.addEventListener('click', async (e) => {
    if (!inputEnabled) return

    const addBtn = e.target.closest('#add-option')
    const backBtn = e.target.closest('#back-to-questions')
    const editBtn = e.target.closest('.edit-option-button')
    const deleteBtn = e.target.closest('.delete-option-button')

    if (addBtn) {
      const questionId = document.getElementById('option-question-id')?.value
      showAddEditOption(null, questionId)
    } else if (editBtn) {
      const optionId = editBtn.dataset.id
      const questionId = document.getElementById('option-question-id')?.value
      showAddEditOption(optionId, questionId)
    } else if (backBtn) {
      clearMessage()
      const quizId = document.getElementById('question-quiz-id')?.value
      showQuizQuestions(quizId)
    } else if (editBtn) {
      console.log('Edit option:', editBtn.dataset.id)
    } else if (deleteBtn) {
      console.log('Delete option:', deleteBtn.dataset.id)
    }
  })
}

// Show all options for a question
export const showOptionsForQuestion = async (questionId) => {
  enableInput(false)
  setActiveDiv(optionsDiv)
  document.getElementById('option-question-id').value = questionId

  try {
    const token = getToken()
    const res = await fetch(`/api/v1/options/question/${questionId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (res.status === 200) {
      document.getElementById('options-list').innerHTML = ''
      document.getElementById('options-question-text').textContent =
        data.questionText || 'No question text available'

      data.options.forEach((option) => {
        const card = document.createElement('div')
        card.className =
          'card mb-3 p-3 d-flex flex-row align-items-center justify-content-between gap-3'

        const left = document.createElement('div')
        left.className = 'text-start'
        left.innerHTML = `<h5>${option.optionText}</h5>`

        const right = document.createElement('div')
        right.className =
          'd-flex align-items-center gap-3 flex-nowrap justify-content-end'

        if (option.isCorrect) {
          const correctText = document.createElement('div')
          correctText.className =
            'text-success fw-semibold text-center d-flex align-items-center gap-2'
          correctText.style.width = '120px'
          correctText.innerHTML = `<i class="fa fa-check fa-lg"></i> Correct`
          right.appendChild(correctText)
        }

        const editBtn = document.createElement('button')
        editBtn.className = 'btn btn-outline-secondary edit-option-button'
        editBtn.innerHTML = '<i class="fa fa-pencil"></i> Edit'
        editBtn.dataset.id = option._id

        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'btn btn-outline-danger delete-option-button'
        deleteBtn.innerHTML = '<i class="fa fa-trash"></i> Delete'
        deleteBtn.dataset.id = option._id

        right.append(editBtn, deleteBtn)
        card.append(left, right)
        document.getElementById('options-list').appendChild(card)
      })

      if (isMessageEmpty()) {
        setMessage(`Loaded ${data.count} option${data.count === 1 ? '' : 's'}.`)
      }
    } else {
      setMessage(data.msg || 'Failed to load options.')
    }
  } catch (err) {
    console.error(err)
    setMessage('A communication error occurred while loading options.')
  } finally {
    enableInput(true)
  }
}
