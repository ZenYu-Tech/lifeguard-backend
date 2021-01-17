const db = require('../models')
const { Article, ArticleImage, Image } = db
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

let articleController = {
  frontGetAllArticles: async (req, res) => {
    try {
      const count = req.query.count || 10
      const page = req.query.page || 1

      const articles = await Article.findAndCountAll({
        where: {
          category: req.params.category, show: true
        },
        attributes: ['articleId', 'title', 'content', 'category', 'createdAt', 'sort'],
        order: ['sort'],
        limit: Number(count),
        offset: (page - 1) * count,
        include: [
          { model: ArticleImage, where: { mainImage: true }, include: { model: Image } }]
      })

      const articleWithPicture = articles.rows.map(a => {

        const pic = path.join(__dirname, '..', a.ArticleImages[0].Image.url)
        let binaryData = fs.readFileSync(pic)
        let base64String = new Buffer.from(binaryData).toString("base64")

        return {
          articleId: a.articleId,
          title: a.title,
          content: a.content,
          category: a.category,
          sort: a.sort,
          createdAt: a.createdAt,
          mainImage: base64String,
        }
      })


      return res.json({
        message: '成功獲得文章',
        result: {
          pagination: {
            page,
            count,
            totalCount: articles.count,
            totalPage: Math.ceil(articles.count / count)
          },
          articles: articleWithPicture,
        }
      })

    } catch (err) {
      console.log(err)
    }
  },

  frontGetArticle: async (req, res) => {
    try {
      const article = await Article.findOne({
        where: { category: req.params.category, articleId: req.params.articleId, show: true },
        attributes: ['articleId', 'title', 'content', 'category', 'sort', 'createdAt'],
        include: [{
          model: Image,
          as: 'images',
          attributes: ['imageId', 'url']
        }]
      })

      const pics = article.images.map(image => {

        const pic = path.join(__dirname, '..', image.url)
        let binaryData = fs.readFileSync(pic)
        let base64String = new Buffer.from(binaryData).toString("base64")
        return {
          imageId: image.imageId,
          main: image.ArticleImage.mainImage,
          image: base64String
        }
      })

      return res.json({
        message: '成功獲得文章',
        result: {
          articleId: article.articleId,
          title: article.title,
          content: article.content,
          category: article.category,
          createdAt: article.createdAt,
          images: pics
        }
      })
    } catch (err) {
      console.log(err)
    }
  },

  backGetAllArticles: async (req, res) => {
    try {
      const count = req.query.count || 10
      const page = req.query.page || 1

      const articles = await Article.findAndCountAll(
        {
          order: ['sort'],
          limit: Number(count),
          offset: (page - 1) * count,
        }
      )
      return res.json({
        message: '成功獲得文章',
        result: {
          pagination: {
            page,
            count,
            totalCount: articles.count,
            totalPage: Math.ceil(articles.count / count)
          },
          articles: articles.rows
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  backGetArticle: async (req, res) => {
    try {
      const article = await Article.findOne({
        where: { category: req.params.category, articleId: req.params.articleId },
        include: [{
          model: Image,
          as: 'images',
          attributes: ['imageId', 'url']
        }]
      })

      console.log(article, 'a')

      const pics = article.images.map(image => {

        const pic = path.join(__dirname, '..', image.url)
        let binaryData = fs.readFileSync(pic)
        let base64String = new Buffer.from(binaryData).toString("base64")
        return {
          imageId: image.imageId,
          main: image.ArticleImage.mainImage,
          image: base64String
        }
      })

      return res.json({
        message: '成功載入文章',
        result: {
          articleId: article.articleId,
          title: article.title,
          content: article.content,
          images: pics
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  createArticle: async (req, res) => {
    try {
      const { title, content, mainImageIndex } = req.body
      const category = req.params.category
      const { files } = req

      if (!title) {
        return res.status(403).send({
          message: '請輸入Title',
          result: {}
        })
      }

      if (files.length === 0) {
        return res.status(403).send({
          message: '請夾帶首頁圖',
          result: {}
        })
      }

      if (!mainImageIndex) {
        return res.status(403).send({
          message: '請夾帶mainImageIndex參數',
          result: {}
        })
      }

      const article = await Article.create({
        articleId: uuidv4(),
        title,
        category,
        content,
        sort: await Article.count({ where: { category: category } }) + 1,
      })

      for (i = 0; files.length > i; i++) {

        let mainImage = false
        if (i === Number(mainImageIndex)) { mainImage = true }

        const image = await Image.create({
          imageId: uuidv4(),
          url: files[i].path,
        })

        await ArticleImage.create({
          articleImageId: uuidv4(),
          ArticleId: article.articleId,
          ImageId: image.imageId,
          mainImage,
        })

      }

      return res.json({
        message: '成功新增文章',
        result: {}
      })
    } catch (err) {
      console.log(err)
    }
  },
  editArticle: async (req, res) => {
    try {
      const { title, content, mainImageIndex } = req.body
      const { articleId, category } = req.params
      const { files } = req

      if (!title) {
        return res.status(403).send({
          message: '請輸入Title',
          result: {}
        })
      }

      if (!mainImageIndex) {
        return res.status(403).send({
          message: '請帶入mainImageIndex參數',
          result: {}
        })
      }

      //updated article text and title
      const article = await Article.findOne({
        where: { category: category, articleId: articleId }
      })

      await article.update({ title, content })

      //identify old image is main image or not
      const orignalMainImage = await ArticleImage.findOne({ where: { ArticleId: articleId, mainImage: true } })

      if (orignalMainImage.ImageId !== mainImageIndex) {

        await orignalMainImage.update({
          mainImage: false
        })

        const changeInOldImage = await ArticleImage.findOne({ where: { ArticleId: articleId, ImageId: mainImageIndex } })

        if (changeInOldImage) {

          await changeInOldImage.update({
            mainImage: true
          })
        }
      }

      //create image and identify main image or not
      for (i = 0; files.length > i; i++) {

        let mainImage = false
        if (i === Number(mainImageIndex)) { mainImage = true }

        const image = await Image.create({
          imageId: uuidv4(),
          url: files[i].path,
        })
        await ArticleImage.create({
          articleImageId: uuidv4(),
          ArticleId: article.articleId,
          ImageId: image.imageId,
          mainImage,
        })
      }

      return res.json({
        message: '成功編輯文章',
        result: {}
      })
    } catch (err) {
      console.log(err)
    }
  },

  deleteArticle: async (req, res) => {
    try {
      const article = await Article.findOne({ where: { category: req.params.category, articleId: req.params.articleId } })

      await article.update({
        show: false
      })

      return res.json({
        message: '成功刪除文章',
        result: {}
      })

    } catch (err) {
      console.log(err)
    }
  },

  deleteImageFromArticle: async (req, res) => {
    try {

      await ArticleImage.destroy({ where: { ImageId: req.params.imageId, ArticleId: req.params.articleId } })

      return res.json({
        message: '成功刪除圖片',
        result: {}
      })

    } catch (err) {
      console.log(err)
    }
  }
}


module.exports = articleController