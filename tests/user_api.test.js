const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('user api test', () => {

  test('User with existing username can not be created', async () => {
    const userExisting = {
      name: "Existing",
      password: "None",
      username: "Existing"
    }
     await api.post('/api/users').send(userExisting).expect(409).expect("Content-Type", /application\/json/)
  })

  test("can't create users with malformed data", async () => {
    const userMalformed = {
      name: "Malformed",
      password: "qw",
      username: ""
    }
    const res = await api.post('/api/users')
      .send(userMalformed)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    console.log(res.body);
  })

  test('creation succeeds with a fresh username', async () => {
    const rU = Math.random().toString(36).substring(2, 15);
    const user = {
      username: rU,
      password: "sekret",
      name: "unique_test"
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