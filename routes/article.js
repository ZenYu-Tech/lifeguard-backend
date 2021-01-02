const express = require('express')
const router = express.Router()
const articleController = require('../apis/articleController')
// const userController = require('../apis/userController')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './upload/article_image/',
  filename: function (req, file, cb) {
    const filename = file.originalname.split('.')
    cb(null, filename[0] + '-' + Date.now() + '.' + filename[1])
  }
})
const upload = multer({
  storage: storage
}).array('image')

// const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })

//Front stage
router.get('/article/:category', articleController.frontGetAllArticles)
router.get('/article/:category/:articleId', articleController.frontGetArticle)

//Back stage
router.get('/manage/article/:category', articleController.backGetAllArticles)
router.get('/manage/article/:category/:articleId', articleController.backGetArticle)
router.post('/manage/article/:category', upload, articleController.createArticle)
router.put('/manage/article/:category/:articleId', upload, articleController.editArticle)
router.delete('/manage/article/:category/:articleId', articleController.deleteArticle)

module.exports = router
