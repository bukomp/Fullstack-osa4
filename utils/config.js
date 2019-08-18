require('dotenv').config()

let PORT = process.env.PORT
let DB_URI = process.env.DB_URI

module.exports = {
  DB_URI,
  PORT
}