const express = require('express')
const app = express()
const db = require('./models')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')
const articleRouter = require('./routes/front-stage/article')
const fileRouter = require('./routes/front-stage/file')
const videoRouter = require('./routes/front-stage/video')
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//正式環境使用
// const whitelist = [
//   'http://localhost:8080'
// ]

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     },
//   })
// )

app.use(
  cors({
    origin: '*'
  })
)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)