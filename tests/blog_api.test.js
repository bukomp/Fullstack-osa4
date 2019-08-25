const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog');

describe('blog tests', () => {

  test('blogs are returned as json', async () => {
    const res = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are actual amount of blogs', async () => {

    const blogs = await Blog.find({})

    const response = await api.get('/api/blogs')
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogs.length)
  })

  test('id in json', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(r => {
      console.log("+")
      expect(r.id).toBeDefined()
    })
  })

  test('posting blogs', async () => {
    const data = {
      title: "wowee",
      author: "Marx",
      url: "http://lol.com",
      likes: 0
    }

    const blog = await Blog.find({})

    await api.post('/api/blogs').send(data)

    const res = await Blog.find({})

    expect(res.length).toBe(blog.length+1)
  })

  test('likes = something or 0', async () => {
    const data = {
      title: "wowee",
      author: "Marx",
      url: "http://lol.com",
      likes: ""
    }

    const res = await api.post('/api/blogs').send(data)
    console.log(res.body.likes)
    expect(res.body.likes).toBe(0)
  })

  test('Bad Reqest', async () => {
    const data1 = {
      author: "Marx",
      url: "http://lol.com",
      likes: 0
    }

    await api.post('/api/blogs')
      .send(data1)
      .expect(400)

    const data2 = {
      title: "wowee",
      author: "Marx",
      likes: 0
    }

    await api.post('/api/blogs')
      .send(data2)
      .expect(400)
  })


  afterAll(() => {
    mongoose.connection.close()
  })
})

