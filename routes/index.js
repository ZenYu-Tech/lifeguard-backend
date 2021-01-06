const adminArticle = require('./admin/article')
const adminFile = require('./admin/file')
const adminVideo = require('./admin/video')

const article = require('./front-stage/article')
const file = require('./front-stage/file')
const video = require('./front-stage/video')

module.exports = (app) => {
  app.use('/articles', article)
  app.use('/files', file)
  app.use('/videos', video)
  app.use('/manage/articles', adminArticle)
  app.use('/manage/files', adminFile)
  app.use('/manage/videos', adminVideo)
}