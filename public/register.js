import {
  inputEnabled,
  enableInput,
  clearMessage,
  setMessage,
  setActiveDiv,
  setToken,
} from './index.js'
import { showLoginRegister } from './loginRegister.js'
import { showQuizzes } from './quizzes.js'


let registerDiv = null

// Variables for input fields to be used in the registration form
let name = null
let email = null
let registerPassword = null
let verifyPassword = null

export const handleRegister = () => {
  registerDiv = document.getElementById('register-div')
  name = document.getElementById('name')
  email = document.getElementById('register-email')
  registerPassword = document.getElementById('register-password')
  verifyPassword = document.getElementById('verify-password')
  const registerButton = document.getElementById('register-button')
  const registerCancelButton = document.getElementById('register-cancel')
  const registerForm = document.getElementById('register-form')

  // Prevent the default form submission behavior
  registerForm.onsubmit = (e) => {
    e.preventDefault() // Prevent the default form submission
    if (!inputEnabled) return // If input is not enabled, do nothing
    // Trigger the register button click event
    registerButton.click()
  }

  // Attach a single click event listener to the parent div (event delegation)
  registerDiv.addEventListener('click', async (e) => {
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === registerButton) {
        clearMessage()

        // Compare passwords before sending the request
        if (registerPassword.value != verifyPassword.value) {
          setMessage('The passwords entered do not match.')
          return // If passwords don't match, exit the function immediately
        }

        enableInput(false) // Disable input

        try {
          // Send registration data to the backend
          const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name.value,
              email: email.value,
              password: registerPassword.value,
            }),
          })

          const data = await response.json() // Parse the JSON response from the server

          if (response.status === 201) { // Check for successful creation
            setMessage(`Registration successful. Welcome ${data.user.name}`)
            setToken(data.token) // Store the received JWT token

            // Clear input field
            clearRegisterForm()

            // Show the quizzes list
            showQuizzes()
          } else {
            // If the request is not successful, display the error message from the backend
            setMessage(data.msg)
          }
        } catch (err) {
          // Handle network errors or other unexpected issues
          console.error(err) // Log the error to console for debugging
          setMessage('A communications error occurred.') // Display a generic error message to the user
        } finally {
          enableInput(true) // Re-enable input regardless of success or failure
        }
      } else if (e.target === registerCancelButton) {
        // When cancel button is clicked, return to login/register choice
        clearRegisterForm() // Clear the registration form fields
        clearMessage()      // Clear any previous messages
        showLoginRegister()
      }
    }
  })
}

const clearRegisterForm = () => {
  // Clears the input fields in the registration form
  name.value = ''
  email.value = ''
  registerPassword.value = ''
  verifyPassword.value = ''
}

export const showRegister = () => {
  clearRegisterForm()
  clearMessage()
  setActiveDiv(registerDiv)
}
