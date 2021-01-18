const adminArticle = require('./admin/article')
const adminFile = require('./admin/file')
const adminVideo = require('./admin/video')
const adminUser = require('./admin/user')

const article = require('./front-stage/article')
const file = require('./front-stage/file')
const video = require('./front-stage/video')

module.exports = (app) => {
  app.use('/article', article)
  app.use('/file', file)
  app.use('/video', video)
  app.use('/manage/article', adminArticle)
  app.use('/manage/file', adminFile)
  app.use('/manage/video', adminVideo)
  app.use('/manage/user', adminUser)
}