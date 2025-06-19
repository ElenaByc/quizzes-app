import {
  inputEnabled,
  setActiveDiv,
  clearMessage,
  setMessage,
  enableInput,
  setToken,
} from './index.js'
import { showLoginRegister } from './loginRegister.js'
import { showQuizzes } from './quizzes.js'

let loginDiv = null
let email = null
let password = null

export const handleLogin = () => {
  loginDiv = document.getElementById('login-div')
  email = document.getElementById('email')
  password = document.getElementById('password')
  const loginButton = document.getElementById('login-button')
  const loginCancelButton = document.getElementById('login-cancel')
  const loginForm = document.getElementById('login-form')

  loginForm.onsubmit = (e) => {
    e.preventDefault() // Prevent the default form submission behavior
    if (!inputEnabled) return // If input is not enabled, do nothing
    // Trigger the login button click event
    loginButton.click()
  }

  // Use event delegation on the parent div for button clicks
  loginDiv.addEventListener('click', async (e) => {
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === loginButton) {
        // Clear any previous messages (if applicable)
        clearMessage()

        // Disable input to prevent multiple submissions
        enableInput(false)

        try {
          // Send login data to the backend API
          const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email.value,
              password: password.value,
            }),
          })

          const data = await response.json() // Parse the JSON response

          if (response.status === 200) { // Check for successful login (HTTP 200 OK)
            setMessage(`Login successful. Welcome ${data.user.name}`)
            setToken(data.token) // Save the received JWT token

            // Clear input fields
            clearLoginForm()

            // Show the quizzes list
            showQuizzes()
          } else {
            // If the request is not successful, display the error message from the backend
            setMessage(data.msg)
          }
        } catch (err) {
          // Catch and log communication errors
          console.error(err) // Log the error to console for debugging
          setMessage('A communications error occurred.') // Display a generic error message to the user
        } finally {
          enableInput(true) // Re-enable input regardless of success or failure
        }
      } else if (e.target === loginCancelButton) {
        // When cancel button is clicked, return to login/register choice
        clearLoginForm() // Clear the login form fields
        clearMessage()      // Clear any previous messages
        showLoginRegister()
      }
    }
  })
}

// Clears the input fields in the login form
const clearLoginForm = () => {
  email.value = ''
  password.value = ''
}

// Clears input fields and shows the login form
export const showLogin = () => {
  clearLoginForm()
  clearMessage()
  setActiveDiv(loginDiv) // Make the login div visible
}
