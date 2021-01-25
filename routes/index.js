const adminArticle = require('./admin/article')
const adminFile = require('./admin/file')
const adminVideo = require('./admin/video')
const adminUser = require('./admin/user')

const article = require('./front-stage/article')
const file = require('./front-stage/file')
const video = require('./front-stage/video')

const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

module.exports = (app) => {
  app.use('/article', article)
  app.use('/file', file)
  app.use('/video', video)
  app.use('/manage/article', authenticated, adminArticle)
  app.use('/manage/file', authenticated, adminFile)
  app.use('/manage/video', authenticated, adminVideo)
  app.use('/manage/user', adminUser)
}