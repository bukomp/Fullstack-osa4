const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect([
      {
        "title": "wowwee",
        "author": "String",
        "url": "String",
        "likes": 0,
        "id": "5d5522e4606adb3ccc02bd7e"
      },
      {
        "title": "wowwee",
        "author": "String",
        "url": "String",
        "likes": 0,
        "id": "5d591eda774d0c2a70556d46"
      },
      {
        "title": "wowwee",
        "author": "String",
        "url": "String",
        "likes": 0,
        "id": "5d5922078a5a4e239438bd63"
      },
      {
        "title": "wowwee",
        "author": "String",
        "url": "String",
        "likes": 0,
        "id": "5d59225a024eb224689a6893"
      }
    ])
})

test('there are four notes', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(4)
})

afterAll(() => {
  mongoose.connection.close()
})