import { inputEnabled, setActiveDiv } from './index.js'
import { showQuizzesToTake } from './quizzes.js'
import { showQuizManagement } from './quizzes.js'

const mainNav = document.getElementById('main-nav')
const welcomeDiv = document.getElementById('welcome-screen')
const navExploreButton = document.getElementById('nav-explore-button')
const navManageQuizzesButton = document.getElementById('nav-manage-button')
const exploreButton = document.getElementById('explore-button')
const manageQuizzesButton = document.getElementById('manage-button')

export const handleExploreManage = () => {
  mainNav.addEventListener('click', (e) => {
    // Check if input is enabled and if the clicked element is a BUTTON
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === navExploreButton) {
        showQuizzesToTake()
      } else if (e.target === navManageQuizzesButton) {
        showQuizManagement()
      }
    }
  })
  welcomeDiv.addEventListener('click', (e) => {
    // Check if input is enabled and if the clicked element is a BUTTON
    if (inputEnabled && e.target.nodeName === 'BUTTON') {
      if (e.target === exploreButton) {
        showQuizzesToTake()
      } else if (e.target === manageQuizzesButton) {
        showQuizManagement()
      }
    }
  })
}

export const showWelcomeScreen = () => {
  setActiveDiv(welcomeDiv)
}
