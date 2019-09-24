const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken')


blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .populate('user', {username:1,name:1})
    .then(blogs => {
      response.json(blogs.map(u => u.toJSON()))
    })
})

blogRouter.post('/', async (req, res, next) => {
  const body = req.body;
  const token = req.token

  console.log(req.body);
  try {

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (typeof req.body.likes !== 'number') req.body.likes = 0

    if (!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('url')) {
      res.status(400).send({error: 'url or title is missing'})
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)

  } catch (e) {
    next(e)
  }
})

blogRouter.delete('/:id', async (req, res, next) => {
  try {

    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(req.params.id)

    if (blog === null) return res.status(404).json({error: "no data found"})

    if( blog !== null && user._id.toString() === blog.user.toString()) {
      console.log("yee");
      await blog.remove()
    }

    res.status(204).send()

  } catch (e) {
    next(e)
  }
})

blogRouter.put('/:id', async (req, res) => {

  if (typeof req.body.likes !== 'number') req.body.likes = 0

  const update = await Blog.findByIdAndUpdate(req.params.id, req.body.likes)

  if (update === null) res.status(404).json({error: "no data found"})

  res.status(200).json(update)
})

module.exports = blogRouter;