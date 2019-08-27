const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, rObj) => {
    rObj.id = rObj._id.toString()
    delete rObj._id
    delete rObj.__v
    // the passwordHash should not be revealed
    delete rObj.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User