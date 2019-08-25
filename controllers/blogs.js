const blogRouter = require('express').Router();
const Blog = require('../models/blog');


blogRouter.get('', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.post('', (req, res, next) => {

  if (typeof req.body.likes !== 'number') req.body.likes = 0
  if (!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('url')) {
    res.status(400).send({error: 'url or title is missing'})
  } else {

    const blog = new Blog(req.body)

    blog
      .save()
      .then(result => {
        res.status(201).json(result)
      })
      .catch(e => {
        next(e)
      })
  }
})

blogRouter.delete('/:id', async (req, res) => {

  const remove = await Blog.findByIdAndRemove(req.params.id)

  if(remove === null) res.status(404).json({error:"no data found"})

  res.status(204).send()
})

blogRouter.put('/:id', async (req, res) => {

  if (typeof req.body.likes !== 'number') req.body.likes = 0

  const update = await Blog.findByIdAndUpdate(req.params.id, req.body.likes)

  if (update === null) res.status(404).json({error: "no data found"})

  res.status(200).json(update)
})

module.exports = blogRouter;