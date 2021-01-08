const express = require('express')
const router = express.Router()
const articleController = require('../../apis/articleController')

router.get('/:category', articleController.frontGetAllArticles)
router.get('/:category/:articleId', articleController.frontGetArticle)


module.exports = router
