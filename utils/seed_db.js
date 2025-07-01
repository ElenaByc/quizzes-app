const User = require('../models/User')
const Quiz = require('../models/Quiz')
const { fakerEN_US: faker } = require('@faker-js/faker')
const FactoryBot = require('factory-bot')
require('dotenv').config()

const factory = FactoryBot.factory
factory.setAdapter(new FactoryBot.MongooseAdapter())

// Password for the test user, used in authentication tests
// This password is not hashed, as it is used for testing purposes only
const testUserPassword = faker.internet.password()

// Define a user factory
factory.define('user', User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
})

// Define a quiz factory
factory.define('quiz', Quiz, {
  title: () => faker.lorem.words({ min: 2, max: 5 }),
  description: () => faker.lorem.sentence({ min: 5, max: 12 }),
  subject: () =>
    faker.helpers.arrayElement([
      'Math',
      'Astronomy',
      'Physics',
      'Chemistry',
      'Biology',
      'History',
      'Literature',
      'Geography',
      'Music',
      'Other',
    ]),
  isPublished: () => faker.datatype.boolean(),
  createdBy: FactoryBot.assoc('user', '_id'),
})

// Seed function to set up a test user and test quizzes
const seed_db = async () => {
  let testUser = null
  try {
    await User.deleteMany({}) // delete all users
    await Quiz.deleteMany({}) // delete all quizzes

    testUser = await factory.create('user', { password: testUserPassword })
    // For testing purposes
    console.log('Email:', testUser.email)
    console.log('Password:', testUserPassword)
    // Create 10 quizzes for the test user
    console.log('Creating 10 quizzes for the test user...')
    await factory.createMany('quiz', 10, { createdBy: testUser._id })
  } catch (e) {
    console.log('Seeding error:', e.message)
    throw e
  }
  return testUser
}

module.exports = { testUserPassword, factory, seed_db }
