const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('user api test', () => {

  test('creation succeeds with a fresh username', async () => {
    const user = {
      username: "bukomp",
      password: "sekret",
      name: "Edvard"
    }
    const post = await api.post('/api/users')
      .send(user)
      .expect(200)

    console.log(post.body);
  })

  test('getting user list', async () => {
    let actualList = await User.find({})
    actualList = actualList.map(u => u.toJSON());
    const res = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
    expect(res.body).toEqual(actualList)
  })



  /*afterAll(() => {
    mongoose.connection.close()
  })*/

})