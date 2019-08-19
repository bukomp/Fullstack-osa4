const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)
}

const favouriteBlog = (blogs) => {
  let likes = 0;
  let favBlog;
  blogs.forEach(blog => {
    if(blog.likes > likes){
      likes = blog.likes
      favBlog = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
        url: blog.url
      }
    }
  })
  return favBlog
}

const mostBlogs = (blogs) => {
  const blogsList = []

  blogs.forEach(blog => {
    if(blogsList.some(tb => tb.author === blog.author)){
      const blogger = blogsList.find(tb => tb.author === blog.author)
      blogger.blogs++
    } else {
      blogsList.push({
        author: blog.author,
        blogs: 1
      })
    }
  })

  const maxBy = (array, fn) => {
    return array.map(function(x) {
      return [x, fn(x)]
    }).reduce(function(max, x) {
      return x[1] > max[1] ? x : max;
    })[0]
  }

  return maxBy(blogsList, bl => bl.blogs )
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}