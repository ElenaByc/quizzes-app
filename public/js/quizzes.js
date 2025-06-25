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
import { showQuizQuestions } from './questions.js'

let quizzesDiv = null

export const handleQuizzes = () => {
  // Initialize the quizzes-related elements
  quizzesDiv = document.getElementById('quizzes')
  const addQuizButton = document.getElementById('add-quiz')

  // Use event delegation on the parent div for button clicks
  quizzesDiv.addEventListener('click', async (e) => {
    if (!inputEnabled) return

    const editBtn = e.target.closest('.edit-quiz-button')
    const deleteBtn = e.target.closest('.delete-quiz-button')
    const questionsBtn = e.target.closest('.quiz-questions-button')
    const addQuizBtn = e.target.closest('#add-quiz')

    if (addQuizBtn) {
      showAddEditQuiz(null)
    } else if (editBtn) {
      clearMessage()
      showAddEditQuiz(editBtn.dataset.id)
    } else if (deleteBtn) {
      enableInput(false) // Disable input during the operation
      const quizId = deleteBtn.dataset.id // Get the ID of the quiz to be deleted

      try {
        const token = getToken() // Get the authentication token

        // Send a DELETE request to the server
        const response = await fetch(`/api/v1/quizzes/${quizId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the JWT token for authentication
          },
        })

        const data = await response.json() // Parse the JSON response

        if (response.status === 200) {
          // Check for successful deletion (server returns 200 OK with message)
          setMessage(data.msg || 'The quiz entry was deleted.')
          showQuizManagement() // Refresh the quiz list to show the updated state
        } else {
          setMessage(data.msg || 'Failed to delete quiz.') // Display error message from backend
        }
      } catch (err) {
        console.error(err) // Log network errors to console
        setMessage('A communication error occurred while deleting quiz.') // Generic error message for user
      } finally {
        enableInput(true) // Re-enable input regardless of success or failure
      }
    } else if (questionsBtn) {
      clearMessage()
      const quizId = questionsBtn.dataset.id
      showQuizQuestions(quizId)
    }
  })
}

export const showQuizzesToTake = async () => {
  document.getElementById('add-quiz').classList.add('d-none') // Hide the "Add Quiz" button
  enableInput(false) // Disable input while fetching data
  setActiveDiv(quizzesDiv) // Make the quizzes list div visible

  try {
    const token = getToken() // Get the user's authentication token

    // Fetch all quizzes from the backend
    const response = await fetch('/api/v1/quizzes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the JWT token for authentication
      },
    })

    const data = await response.json() // Parse the JSON response

    if (response.status === 200) {
      const quizListDiv = document.getElementById('quizzes-list')
      quizListDiv.innerHTML = '' // Clear existing

      data.quizzes.forEach((quiz) => {
        const card = document.createElement('div')
        card.className =
          'card mb-3 p-3 d-flex flex-row align-items-center justify-content-between gap-3'

        const titleBlock = document.createElement('div')
        titleBlock.className = 'text-start'
        titleBlock.style.maxWidth = '45%'
        titleBlock.innerHTML = `
          <h4 class="mb-0">${quiz.title}</h4>
          <div class="text-secondary">${quiz.description || ''}</div>
        `

        const rightSide = document.createElement('div')
        rightSide.className =
          'd-flex align-items-center gap-3 flex-nowrap justify-content-end'

        const subjectText = document.createElement('div')
        subjectText.className = 'text-center'
        subjectText.style.width = '160px'
        subjectText.textContent = quiz.subject

        const takeButton = document.createElement('button')
        takeButton.className = 'btn btn-outline-secondary take-quiz-button'
        takeButton.innerHTML = `<i class="fa fa-play"></i> Take Quiz`
        takeButton.dataset.id = quiz._id

        rightSide.append(subjectText, takeButton)
        card.append(titleBlock, rightSide)
        quizListDiv.appendChild(card)
      })

      if (isMessageEmpty()) {
        setMessage(`Found ${data.count} quizzes to take.`)
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

export const showQuizManagement = async () => {
  document.getElementById('add-quiz').classList.remove('d-none')
  enableInput(false) // Disable input while fetching data
  setActiveDiv(quizzesDiv) // Make the quizzes list div visible

  try {
    const token = getToken() // Get the user's authentication token

    // Fetch all quizzes from the backend
    const response = await fetch('/api/v1/quizzes/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the JWT token for authentication
      },
    })

    const data = await response.json() // Parse the JSON response

    if (response.status === 200) {
      const quizListDiv = document.getElementById('quizzes-list')
      quizListDiv.innerHTML = '' // Clear old content

      data.quizzes.forEach((quiz) => {
        const card = document.createElement('div')
        card.className =
          'card mb-3 p-3 d-flex flex-row align-items-center justify-content-between gap-3'
        // Title on the left
        const titleBlock = document.createElement('div')
        titleBlock.className = 'text-start'
        titleBlock.style.maxWidth = '45%'
        titleBlock.innerHTML = `
        <h4 class="mb-0">${quiz.title}</h4>
        <div class="text-secondary">${quiz.description || ''}</div>
        `

        // Right-side: subject + status + buttons grouped
        const rightSide = document.createElement('div')
        rightSide.className =
          'd-flex align-items-center gap-3 flex-nowrap justify-content-end'

        const subjectText = document.createElement('div')
        subjectText.className = 'text-center'
        subjectText.style.width = '160px'
        subjectText.textContent = quiz.subject

        const statusLabel = document.createElement('div')
        statusLabel.style.width = '120px'
        statusLabel.className = quiz.isPublished
          ? 'text-success fw-semibold text-center'
          : 'text-secondary fw-semibold text-center'
        statusLabel.textContent = quiz.isPublished ? 'Published' : 'Draft'

        const questionsButton = document.createElement('button')
        questionsButton.className =
          'btn btn-outline-secondary quiz-questions-button'
        questionsButton.innerHTML = `<i class="fa fa-list"></i> Questions`
        questionsButton.dataset.id = quiz._id

        const editButton = document.createElement('button')
        editButton.className = 'btn btn-outline-secondary edit-quiz-button'
        editButton.innerHTML = `<i class="fa fa-pencil"></i> Edit`
        editButton.dataset.id = quiz._id

        const deleteButton = document.createElement('button')
        deleteButton.className = 'btn btn-outline-danger delete-quiz-button'
        deleteButton.innerHTML = `<i class="fa fa-trash"></i> Delete`
        deleteButton.dataset.id = quiz._id

        rightSide.append(
          subjectText,
          statusLabel,
          questionsButton,
          editButton,
          deleteButton,
        )

        // Put title on the left, everything else on the right
        card.append(titleBlock, rightSide)
        quizListDiv.appendChild(card)
      })

      if (isMessageEmpty()) {
        // If no previous message, display the number of quizzes loaded
        setMessage(`Loaded ${data.count} quizzes.`)
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
