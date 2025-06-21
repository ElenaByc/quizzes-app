import { inputEnabled, setActiveDiv } from './index.js'
import { showLogin } from './login.js'
import { showRegister } from './register.js'

const loginRegisterDiv = document.getElementById('login-register')
const loginButton = document.getElementById('login')
const registerButton = document.getElementById('register')
const headerLoginRegisterDiv = document.getElementById('header-login-register')
const headerLoginButton = document.getElementById('header-login-button')
const headerRegisterButton = document.getElementById('header-register-button')

// Function to handle events on the login/register choice screen
export const handleLoginRegister = () => {
  // Attach a single click event listener to the parent div (event delegation).
  // This listener will then determine which button was clicked.
  loginRegisterDiv.addEventListener('click', (e) => {
    // Check if input is enabled and if the clicked element is a BUTTON
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === loginButton) {
        showLogin() // Show the login form
      } else if (e.target === registerButton) {
        showRegister() // Show the registration form
      }
    }
  })
  headerLoginRegisterDiv.addEventListener('click', (e) => {
    // Check if input is enabled and if the clicked element is a BUTTON
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === headerLoginButton) {
        showLogin() // Show the login form
      } else if (e.target === headerRegisterButton) {
        showRegister() // Show the registration form
      }
    }
  })
}

// Function to explicitly show the login/register choice screen
export const showLoginRegister = () => {
  setActiveDiv(loginRegisterDiv)
}
