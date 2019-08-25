const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  const res = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(res.body.length).toBe(2)

})

test('there are four notes', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(4)
})

afterAll(() => {
  mongoose.connection.close()
})