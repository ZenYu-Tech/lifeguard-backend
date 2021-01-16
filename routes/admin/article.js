const express = require('express')
const router = express.Router()
const articleController = require('../../apis/articleController')
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


router.get('/', articleController.backGetAllArticles)
router.get('/:category/:articleId', articleController.backGetArticle)
router.post('/:category', upload, articleController.createArticle)
router.put('/:category/:articleId', upload, articleController.editArticle)
router.delete('/:category/:articleId', articleController.deleteArticle)

router.delete('/:category/:articleId/:imageId', articleController.deleteImageFromArticle)

module.exports = router