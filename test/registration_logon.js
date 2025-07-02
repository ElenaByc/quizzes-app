const { app } = require('../app')
const { factory, seed_db } = require('../utils/seed_db')
const faker = require('@faker-js/faker').fakerEN_US
const get_chai = require('../utils/get_chai')

const User = require('../models/User')

describe('tests for registration and logon', function () {
  // after(() => {
  //   server.close();
  // });

  // I have single page application and this test is not working
  // it('should get the registration page', async () => {
  //   const { expect, request } = await get_chai()
  //   const req = request.execute(app).get('/session/register').send()
  //   const res = await req
  //   expect(res).to.have.status(200)
  //   expect(res).to.have.property('text')
  //   expect(res.text).to.include('<label for="name">Name</label>')
  //   const textNoLineEnd = res.text.replaceAll('\n', '')
  //   const csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)
  //   expect(csrfToken).to.not.be.null
  //   this.csrfToken = csrfToken[1]
  //   expect(res).to.have.property('headers')
  //   expect(res.headers).to.have.property('set-cookie')
  //   const cookies = res.headers['set-cookie']
  //   this.csrfCookie = cookies.find((element) => element.startsWith('csrfToken'))
  //   expect(this.csrfCookie).to.not.be.undefined
  // })

  it('should register the user via API', async () => {
    const { expect, request } = await get_chai()
    const password = faker.internet.password()
    const user = await factory.build('user', { password })

    const dataToPost = {
      name: user.name,
      email: user.email,
      password,
    }

    const req = request
      .execute(app)
      .post('/api/v1/auth/register')
      .set('content-type', 'application/json')
      .send(dataToPost)

    const res = await req

    expect(res).to.have.status(201)
    // can't make it working
    // got this:  AssertionError: expected {} to have property 'user'
    console.log('res.body:', res.body)
    expect(res.body).to.have.property('user')
    expect(res.body.user).to.have.property('email', user.email)
    expect(res.body.user).to.have.property('name', user.name)

    const userInDb = await User.findOne({ email: user.email })
    expect(userInDb).to.not.be.null
  })

  //That’s the CSRF-based form-post version — it’s not valid for your SPA-based app.
  // it('should register the user', async () => {
  //   const { expect, request } = await get_chai()
  //   this.password = faker.internet.password()
  //   this.user = await factory.build('user', { password: this.password })
  //   const dataToPost = {
  //     name: this.user.name,
  //     email: this.user.email,
  //     password: this.password,
  //     password1: this.password,
  //     _csrf: this.csrfToken,
  //   }
  //   const req = request
  //     .execute(app)
  //     .post('/')
  //     .set('Cookie', this.csrfCookie)
  //     .set('content-type', 'application/x-www-form-urlencoded')
  //     .send(dataToPost)
  //   const res = await req
  //   expect(res).to.have.status(200)
  //   expect(res).to.have.property('text')
  //   expect(res.text).to.include('What would you like to do?')
  //   newUser = await User.findOne({ email: this.user.email })
  //   expect(newUser).to.not.be.null
  // })
})
