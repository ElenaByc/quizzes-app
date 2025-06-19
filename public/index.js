import { showQuizzes, handleQuizzes } from './quizzes.js'
import { showLoginRegister, handleLoginRegister } from './loginRegister.js'
import { handleLogin } from './login.js'
import { handleAddEditQuiz } from './addEditQuiz.js'
import { handleRegister } from './register.js'

// Flag indicating if user input is enabled (e.g., during an API request)
export let inputEnabled = true
// Variable to track the currently active(visible) div in the UI
let activeDiv = null
// Variable for the element where messages will be displayed to the user
let message = null

// Clear the message text
export const clearMessage = () => {
  if (message) {
    message.textContent = ''
  }
}

// Set the message text
export const setMessage = (text) => {
  if (message) {
    message.textContent = text
  }
}

export const isMessageEmpty = () => {
  return !message || message.textContent.trim() === ''
}

// Function to set the active div: hides the previous one and shows the new one
export const setActiveDiv = (newDiv) => {
  if (newDiv === activeDiv) {
    return
  }
  if (activeDiv) {
    activeDiv.style.display = 'none' // Hide the previously active div
  }
  newDiv.style.display = 'block' // Show the new div
  activeDiv = newDiv // Update the active div reference
}

// Function to enable/disable user input
export const enableInput = (state) => {
  inputEnabled = state
}

// Variable to store the user's JWT token
let token = null

// Function to set the token and store it in the browser's local storage
export const setToken = (value) => {
  token = value
  if (value) {
    localStorage.setItem('token', value) // Save the token if it exists
  } else {
    localStorage.removeItem('token') // Remove the token if it's null (user logged off)
  }
}

// Function to get the current token value
export const getToken = () => {
  return token // Return the current token value
}


document.addEventListener('DOMContentLoaded', () => {
  token = localStorage.getItem('token')
  message = document.getElementById('message')

  handleLoginRegister()
  handleLogin()
  handleQuizzes()
  handleRegister()
  handleAddEditQuiz()

  if (token) {
    showQuizzes()
  } else {
    showLoginRegister()
  }

})
