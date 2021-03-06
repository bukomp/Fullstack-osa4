const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.post('/', async (req, res, next) => {


  try {
    const body = req.body
    const dbCheck = await User.findOne({username: body.username})
    if(body.password === undefined || body.password.length < 3) res.status(400).json({error: "password must be at least 3 characters long"})
    else if(body.username === undefined || body.username.length < 3) res.status(400).json({error: "username must exist"})
    else if(dbCheck !== null) res.status(409).json({error: "user with particular username already exists"})
    else {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)

      const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        blogs:[]
      })

      const savedUser = await user.save()

      res.json(savedUser)
    }
  } catch (e) {
    next(e)
  }
})

usersRouter.get('/', async (req, res, next) => {
  try{
    const users = await User.find({}).populate('blogs', {url:1, title:1, author:1})
    res.json(users)
  } catch (e) {
    next(e)
  }
})

/*usersRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.find({})
  } catch (e) {
    next(e)
  }
})*/

module.exports = usersRouter