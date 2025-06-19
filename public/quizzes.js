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
import { showAddEditQuiz } from './addEditQuiz.js'

let quizzesDiv = null
let quizzesTableBody = null

export const handleQuizzes = () => {
  // Initialize the quizzes-related elements
  quizzesDiv = document.getElementById('quizzes')
  quizzesTableBody = document.getElementById('quizzes-table-body')
  const logoutButton = document.getElementById('logout')
  const addQuizButton = document.getElementById('add-quiz')

  // Use event delegation on the parent div for button clicks
  quizzesDiv.addEventListener('click', async (e) => {
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === addQuizButton) {
        showAddEditQuiz(null)
      } else if (e.target === logoutButton) {
        setToken(null) // Clear the token to log out
        setMessage('You have been logged out.') // Show logout message
        quizzesTableBody.innerHTML = '' // Clear the quizzes table body
        showLoginRegister()
      } else if (e.target.classList.contains('edit-quiz-button')) {
        clearMessage()
        showAddEditQuiz(e.target.dataset.id)
      } else if (e.target.classList.contains('delete-quiz-button')) {
        enableInput(false) // Disable input during the operation
        const quizId = e.target.dataset.id // Get the ID of the quiz to be deleted

        try {
          const token = getToken() // Get the authentication token

          // Send a DELETE request to the server
          const response = await fetch(`/api/v1/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the JWT token for authentication
            },
          })

          const data = await response.json() // Parse the JSON response

          if (response.status === 200) { // Check for successful deletion (server returns 200 OK with message)
            setMessage(data.msg || 'The quiz entry was deleted.')
            showQuizzes() // Refresh the quiz list to show the updated state
          } else {
            setMessage(data.msg || 'Failed to delete quiz.') // Display error message from backend
          }
        } catch (err) {
          console.error(err) // Log network errors to console
          setMessage('A communication error occurred while deleting quiz.') // Generic error message for user
        } finally {
          enableInput(true) // Re-enable input regardless of success or failure
        }
      }
    }
  })
}

// Shows the quizzes list display.
export const showQuizzes = async () => {
  // clearMessage() // Clear any previous messages
  setActiveDiv(quizzesDiv) // Make the quizzes list div visible
  enableInput(false) // Disable input while fetching data

  try {
    const token = getToken() // Get the user's authentication token

    // Fetch all quizzes from the backend
    const response = await fetch('/api/v1/quizzes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the JWT token for authentication
      },
    })

    const data = await response.json() // Parse the JSON response

    if (response.status === 200) { // Check for successful response
      // Clear previous quizzes from the table
      quizzesTableBody.innerHTML = ''

      // Add each quiz to the table
      data.quizzes.forEach((quiz) => {
        const row = quizzesTableBody.insertRow(-1) // Insert a new row at the end

        row.insertCell(0).textContent = quiz.title
        row.insertCell(1).textContent = quiz.subject
        row.insertCell(2).textContent = quiz.description

        // Add an 'Edit' button
        const editCell = row.insertCell(3)
        const editButton = document.createElement('button')
        editButton.textContent = 'Edit'
        editButton.dataset.id = quiz._id // Store quiz ID for editing
        editButton.classList.add('edit-quiz-button') // Add a class for styling/selection
        editCell.appendChild(editButton)

        // Add a 'Delete' button
        const deleteCell = row.insertCell(4)
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.dataset.id = quiz._id // Store quiz ID for deletion
        deleteButton.classList.add('delete-quiz-button') // Add a class for styling/selection
        deleteCell.appendChild(deleteButton)
      })
      if (isMessageEmpty()) {
        setMessage(`Loaded ${data.count} quizzes.`) // Display number of quizzes loaded
      }
    } else if (response.status === 401) {
      // If token is invalid or expired, log off the user
      setMessage('Authentication failed. Please log in again.')
      setToken(null) // Clear invalid token
      showLoginRegister() // Redirect to login/register page
    } else {
      // Handle other server errors
      setMessage(data.msg || 'Failed to load quizzes.')
    }
  } catch (err) {
    // Catch and log network errors
    console.error(err)
    setMessage('A communications error occurred while loading quizzes.')
  } finally {
    enableInput(true) // Re-enable input regardless of success or failure
  }
}

