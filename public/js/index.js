import { showLoginRegister, handleLoginRegister } from './loginRegister.js'
import { handleLogin } from './login.js'
import { handleRegister } from './register.js'
import { showWelcomeScreen, handleExploreManage } from './exploreManage.js'
import { handleQuizzes } from './quizzes.js'
import { handleAddEditQuiz } from './addEditQuiz.js'
import { handleQuestions } from './questions.js'
import { handleAddEditQuestion } from './addEditQuestion.js'
import { handleOptions } from './options.js'
import { handleAddEditOption } from './addEditOption.js'

// Flag indicating if user input is enabled (e.g., during an API request)
export let inputEnabled = true
// Variable to track the currently active(visible) div in the UI
let activeDiv = null
// Variable for the element where messages will be displayed to the user
let message = null
// Variable to store the logged-in user's name
let userName = null

// Function to set and store the user's name
export const setUserName = (value) => {
  userName = value
  const userGreeting = document.getElementById('user-greeting')
  const headerLoginRegisterDiv = document.getElementById(
    'header-login-register',
  )
  const headerLogoutButton = document.getElementById('header-logout-button')
  const mainNav = document.getElementById('main-nav')
  if (value) {
    localStorage.setItem('userName', value)
    userGreeting.textContent = `Welcome, ${userName}`
    headerLoginRegisterDiv.classList.add('d-none')
    headerLogoutButton.classList.remove('d-none')
    mainNav.classList.remove('d-none')
  } else {
    localStorage.removeItem('userName')
    userGreeting.textContent = ''
    headerLoginRegisterDiv.classList.remove('d-none')
    headerLogoutButton.classList.add('d-none')
    mainNav.classList.add('d-none')
  }
}

// Function to retrieve the user's name
export const getUserName = () => {
  return userName
}

// Clear the message text
export const clearMessage = () => {
  if (message) {
    message.textContent = ''
    message.classList.add('d-none') // Hide the message element
  }
}

// Set the message text
export const setMessage = (text) => {
  if (message && text.trim() !== '') {
    message.textContent = text
    message.classList.remove('d-none') // Show the message element
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
    activeDiv.classList.add('d-none') // Hide the previous section
  }

  newDiv.classList.remove('d-none') // Show the new section

  activeDiv = newDiv
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
  userName = localStorage.getItem('userName')
  message = document.getElementById('message')

  const headerLoginRegisterDiv = document.getElementById(
    'header-login-register',
  )
  const headerLogoutButton = document.getElementById('header-logout-button')
  const mainNav = document.getElementById('main-nav')
  const userGreeting = document.getElementById('user-greeting')

  handleLoginRegister()
  handleLogin()
  handleRegister()
  handleExploreManage()
  handleQuizzes()
  handleAddEditQuiz()
  handleQuestions()
  handleAddEditQuestion()
  handleOptions()
  handleAddEditOption()

  if (userName) {
    userGreeting.textContent = `Welcome, ${userName}`
  }

  // Control header buttons based on token
  if (token) {
    headerLoginRegisterDiv.classList.add('d-none')
    headerLogoutButton.classList.remove('d-none')
    mainNav.classList.remove('d-none')
  } else {
    headerLoginRegisterDiv.classList.remove('d-none')
    headerLogoutButton.classList.add('d-none')
    mainNav.classList.add('d-none')
  }

  // Log out
  headerLogoutButton.addEventListener('click', () => {
    setToken(null)
    setUserName(null)
    headerLoginRegisterDiv.classList.remove('d-none')
    headerLogoutButton.classList.add('d-none')
    mainNav.classList.add('d-none')
    setMessage('You have been logged out.')
    userGreeting.textContent = ''
    // Clear the quizzes table body
    const quizListDiv = document.getElementById('quizzes-list')
    if (quizListDiv) {
      quizListDiv.innerHTML = '' // Clear old content
    }
    const loggedOutDiv = document.getElementById('logged-out')
    setActiveDiv(loggedOutDiv)
  })

  if (token) {
    showWelcomeScreen()
  } else {
    showLoginRegister()
  }
})
