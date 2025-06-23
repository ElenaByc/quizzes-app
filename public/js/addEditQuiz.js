import {
  inputEnabled,
  enableInput,
  clearMessage,
  setMessage,
  getToken,
  setActiveDiv,
} from './index.js'
import { showQuizManagement } from './quizzes.js'

let addEditQuizDiv = null
let addEditQuizForm = null
let quizTitle = null
let quizDescription = null
let quizSubject = null
let quizStatusGroup = null
let submitQuizButton = null

export const handleAddEditQuiz = () => {
  addEditQuizDiv = document.getElementById('edit-quiz')
  addEditQuizForm = document.getElementById('edit-quiz-form')
  quizTitle = document.getElementById('quiz-title')
  quizDescription = document.getElementById('quiz-description')
  quizSubject = document.getElementById('quiz-subject')
  quizStatusGroup = document.getElementById('is-published-group')
  submitQuizButton = document.getElementById('submit-quiz')
  const cancelEditQuizButton = document.getElementById('cancel-edit-quiz')

  addEditQuizForm.onsubmit = (e) => {
    e.preventDefault() // Prevent the default form submission behavior
    if (!inputEnabled) return // If input is not enabled, do nothing
    // Trigger the submit button click event
    submitQuizButton.click()
  }

  // Use event delegation on the parent div for button clicks
  addEditQuizDiv.addEventListener('click', async (e) => {
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === submitQuizButton) {
        enableInput(false) // Disable input during the operation

        let method = 'POST' // Default method is POST for creating a new quiz
        let url = '/api/v1/quizzes' // Default URL for creating quizzes
        let successMessage = 'New quiz was created.' // Default success message
        let isPublished = false
        if (quizStatusGroup && !quizStatusGroup.classList.contains('d-none')) {
          const selectedStatus = addEditQuizForm.querySelector(
            'input[name="isPublished"]:checked',
          )
          if (selectedStatus) {
            isPublished = selectedStatus.value === 'true'
          }
        }

        // Check if we are updating an existing quiz based on the button text and stored ID
        if (
          submitQuizButton.textContent === 'Update Quiz' &&
          addEditQuizDiv.dataset.id
        ) {
          method = 'PATCH' // Change method to PATCH for updating
          url = `/api/v1/quizzes/${addEditQuizDiv.dataset.id}` // Add quiz ID to the URL
          successMessage = 'The quiz was updated.' // Change success message for update
        }

        try {
          const token = getToken() // Get the authentication token

          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Send the token
            },
            body: JSON.stringify({
              title: quizTitle.value,
              description: quizDescription.value,
              subject: quizSubject.value,
              isPublished: isPublished,
            }),
          })

          const data = await response.json()

          // Handle responses: 201 for creation (POST), 200 for update (PATCH)
          if (response.status === 201 || response.status === 200) {
            setMessage(successMessage) // Use the determined success message
            clearAddEditQuizForm() // Clear the form fields
            showQuizManagement() // Return to the quizzes list to see the updated/new entry
          } else {
            setMessage(
              data.msg ||
                `Failed to ${method === 'POST' ? 'create' : 'update'} quiz.`,
            )
          }
        } catch (err) {
          console.error(err) // Log network or other errors to console
          setMessage('A communication error occurred while submitting quiz.') // Generic error message for user
        } finally {
          enableInput(true) // Re-enable input regardless of success or failure
        }
      } else if (e.target === cancelEditQuizButton) {
        // When cancel button is clicked, return to quizzes list
        clearAddEditQuizForm() // Clear the form fields
        setMessage('Quiz adding/editing cancelled.') // Show cancellation message
        showQuizManagement() // Return to the quizzes list
      }
    }
  })
}

// Shows the add/edit quiz form. 'quizId' parameter for editing a specific quiz.
export const showAddEditQuiz = async (quizId) => {
  const formTitle = document.getElementById('edit-quiz-title')
  clearMessage() // Clear any previous messages

  // If quizId is null, it means we are adding a new quiz
  if (!quizId) {
    clearAddEditQuizForm()
    formTitle.textContent = 'Create New Quiz'
    submitQuizButton.textContent = 'Add New Quiz'
    addEditQuizDiv.dataset.id = '' // Clear any previous quiz ID stored in the div
    quizStatusGroup.classList.add('d-none') // Hide the isPublished selector
    setActiveDiv(addEditQuizDiv) // Make the edit/add quiz form div visible
  } else {
    // If quizId is provided, we are editing an existing quiz
    enableInput(false) // Disable input while fetching data

    try {
      const token = getToken() // Get the authentication token
      formTitle.textContent = 'Edit Quiz'
      submitQuizButton.textContent = 'Update Quiz'
      quizStatusGroup.classList.remove('d-none') // Show the isPublished selector

      // Fetch the specific quiz data from the backend
      const response = await fetch(`/api/v1/quizzes/${quizId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send the token
        },
      })

      const data = await response.json() // Parse the JSON response

      if (response.status === 200) {
        // Check for successful response
        // Populate form fields with existing quiz data
        quizTitle.value = data.quiz.title
        quizDescription.value = data.quiz.description || ''
        quizSubject.value = data.quiz.subject

        // Store the quiz ID in the div for later use in PATCH request
        addEditQuizDiv.dataset.id = quizId

        // Update publish status radio button
        const statusRadio = data.quiz.isPublished ? 'published' : 'draft'
        document.getElementById(statusRadio).checked = true

        setActiveDiv(addEditQuizDiv) // Make the form div visible
      } else {
        // Handle cases where the quiz is not found (e.g., if it was deleted)
        setMessage(data.msg || 'The quiz entry was not found.')
        showQuizManagement() // Return to the quizzes list
      }
    } catch (err) {
      // Catch and log network errors
      console.error(err)
      setMessage('A communication error occurred while fetching quiz for edit.')
      showQuizManagement() // Return to the quizzes list
    } finally {
      enableInput(true) // Re-enable input regardless of success or failure
    }
  }
}

// Clears input fields and prepares the form for adding a new quiz
export const clearAddEditQuizForm = () => {
  quizTitle.value = ''
  quizDescription.value = ''
  quizSubject.value = '' // Reset to the default option
}
