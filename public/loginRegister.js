import { inputEnabled, setActiveDiv } from './index.js'
import { showLogin } from './login.js'
import { showRegister } from './register.js'

const loginRegisterDiv = document.getElementById('login-register')
const loginButton = document.getElementById('login')
const registerButton = document.getElementById('register')

// Function to handle events on the login/register choice screen
export const handleLoginRegister = () => {
  // Attach a single click event listener to the parent div (event delegation).
  // This listener will then determine which button was clicked.
  loginRegisterDiv.addEventListener('click', (e) => {
    // Check if input is enabled and if the clicked element is a BUTTON
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === loginButton) { // If the clicked button is the login button
        showLogin() // Show the login form
      } else if (e.target === registerButton) { // If the clicked button is the register button
        showRegister() // Show the registration form
      }
    }
  })
}

// Function to explicitly show the login/register choice screen
export const showLoginRegister = () => {
  setActiveDiv(loginRegisterDiv)
}
