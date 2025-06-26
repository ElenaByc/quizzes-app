import {
  inputEnabled,
  enableInput,
  clearMessage,
  setMessage,
  getToken,
  setActiveDiv,
} from './index.js'
import { showOptionsForQuestion } from './options.js'

let addEditOptionDiv = null
let addEditOptionForm = null
let optionText = null
let optionQuestionId = null
let submitOptionButton = null

export const handleAddEditOption = () => {
  addEditOptionDiv = document.getElementById('edit-option')
  addEditOptionForm = document.getElementById('edit-option-form')
  optionText = document.getElementById('option-text')
  optionQuestionId = document.getElementById('option-question-id')
  submitOptionButton = document.getElementById('submit-option')
  const cancelEditButton = document.getElementById('cancel-edit-option')

  addEditOptionForm.onsubmit = (e) => {
    e.preventDefault()
    if (!inputEnabled) return
    submitOptionButton.click()
  }

  addEditOptionDiv.addEventListener('click', async (e) => {
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === submitOptionButton) {
        enableInput(false)

        const questionId = optionQuestionId.value
        let method = 'POST'
        let url = '/api/v1/options'
        let successMessage = 'New option was created.'

        const isCorrect =
          addEditOptionForm.querySelector('input[name="optionCorrect"]:checked')
            ?.value === 'true'

        const payload = {
          questionId,
          optionText: optionText.value,
          isCorrect,
        }

        if (
          submitOptionButton.textContent === 'Update Option' &&
          addEditOptionDiv.dataset.id
        ) {
          const optionId = addEditOptionDiv.dataset.id
          method = 'PATCH'
          url = `/api/v1/options/${optionId}`
          successMessage = 'The option was updated.'
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
            clearAddEditOptionForm()
            showOptionsForQuestion(questionId)
          } else {
            setMessage(data.msg || 'Failed to save option.')
          }
        } catch (err) {
          console.error(err)
          setMessage('A communication error occurred while saving the option.')
        } finally {
          enableInput(true)
        }
      } else if (e.target === cancelEditButton) {
        const questionId = optionQuestionId.value
        clearAddEditOptionForm()
        setMessage('Option editing cancelled.')
        showOptionsForQuestion(questionId)
      }
    }
  })
}

export const showAddEditOption = async (optionId, questionId) => {
  clearMessage()
  const formTitle = document.getElementById('edit-option-title')
  submitOptionButton.textContent = 'Add New Option'
  formTitle.textContent = 'Create New Option'
  clearAddEditOptionForm()
  optionQuestionId.value = questionId
  addEditOptionDiv.dataset.id = ''

  if (!optionId) {
    setActiveDiv(addEditOptionDiv)
  } else {
    enableInput(false)
    try {
      const token = getToken()
      const response = await fetch(`/api/v1/options/${optionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.status === 200) {
        optionText.value = data.option.optionText
        const radioToCheck = addEditOptionForm.querySelector(
          `input[name="optionCorrect"][value="${data.option.isCorrect}"]`,
        )
        if (radioToCheck) radioToCheck.checked = true

        optionQuestionId.value = data.option.questionId
        addEditOptionDiv.dataset.id = optionId

        submitOptionButton.textContent = 'Update Option'
        formTitle.textContent = 'Edit Option'
        setActiveDiv(addEditOptionDiv)
      } else {
        setMessage(data.msg || 'The option could not be found.')
        showOptionsForQuestion(questionId)
      }
    } catch (err) {
      console.error(err)
      setMessage('A communication error occurred while loading the option.')
      showOptionsForQuestion(questionId)
    } finally {
      enableInput(true)
    }
  }
}

export const clearAddEditOptionForm = () => {
  optionText.value = ''
  optionQuestionId.value = ''
  const defaultRadio = addEditOptionForm.querySelector(
    'input[name="optionCorrect"][value="false"]',
  )
  if (defaultRadio) defaultRadio.checked = true
}
