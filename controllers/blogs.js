const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');


blogRouter.get('', (request, response) => {
  Blog
    .find({})
    .populate('user', {username:1,name:1})
    .then(blogs => {
      response.json(blogs.map(u => u.toJSON()))
    })
})

blogRouter.post('', async (req, res, next) => {
  const body = req.body;
  const user = await User.findById(body.userId)


  if (typeof req.body.likes !== 'number') req.body.likes = 0
  if (!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('url')) {
    res.status(400).send({error: 'url or title is missing'})
  } else {

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    console.log(req.body);
    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      res.status(201).json(savedBlog)
    } catch (e) {
      next(e)
    }
  }
})

blogRouter.delete('/:id', async (req, res) => {

  const remove = await Blog.findByIdAndRemove(req.params.id)

  if(remove === null) res.status(404).json({error:"no data found"})
  else res.status(204).send()
})

blogRouter.put('/:id', async (req, res) => {

  if (typeof req.body.likes !== 'number') req.body.likes = 0

  const update = await Blog.findByIdAndUpdate(req.params.id, req.body.likes)

  if (update === null) res.status(404).json({error: "no data found"})

  res.status(200).json(update)
})

module.exports = blogRouter;