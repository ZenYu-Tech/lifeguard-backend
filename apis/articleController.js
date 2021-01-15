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

      const articleWithPicture = articles.rows.map(async a => {

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
          articleImageId: image.articleImageId,
          main: image.mainImage,
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

      const pics = article.images.map(image => {

        const pic = path.join(__dirname, '..', image.url)
        let binaryData = fs.readFileSync(pic)
        let base64String = new Buffer.from(binaryData).toString("base64")
        return {
          articleImageId: image.articleImageId,
          main: image.mainImage,
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
      const { title, content } = req.body
      const category = req.params.category
      const { files } = req

      console.log(files, 'files')

      if (!title) {
        return res.json({
          message: '請輸入Title',
          result: {}
        })
      }

      if (files.length === 0) {
        return res.json({
          message: '請夾帶首頁圖',
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
        const image = await Image.create({
          imageId: uuidv4(),
          url: files[i].path,

        })

        await ArticleImage.create({
          articleImageId: uuidv4(),
          ArticleId: article.articleId,
          ImageId: image.imageId,
          mainImage: true,
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
      const { title, content, mainImage, deleteImage } = req.body
      const { articleId, category } = req.params
      const { files } = req

      if (!title) {
        return res.json({
          message: '請輸入Title',
          result: {}
        })
      }

      let delImageArray = []

      if (Array.isArray(deleteImage)) {
        delImageArray = deleteImage
      } else {
        if (deleteImage) {
          delImageArray.push(deleteImage)
        }
      }

      const article = await Article.findOne({
        where: { category: category, articleId: articleId }
      })

      const updateArticleText = await article.update({ title, content })



      //create image
      for (i = 0; files.length > i; i++) {
        await ArticleImage.create({
          articleImageId: uuidv4(),
          ArticleId: updateArticleText.articleId,
          url: files[i].path,
        })
      }

      const articleImages = await ArticleImage.findAll({ where: { ArticleId: articleId, show: true } })

      //hidden image and set main image 
      //需要辨識新增的圖案是否為main image 因為在前端新增的圖片沒有articleImageId
      for (i = 0; articleImages.length > i; i++) {
        delImageArray.forEach(async d => {
          if (d === articleImages[i].articleImageId) {
            await articleImages[i].update({
              show: false
            })
          }
        })

        if (articleImages[i].articleImageId !== mainImage) {
          await articleImages[i].update({ mainImage: false })
        } else {
          await articleImages[i].update({ mainImage: true })
        }

      }

      //set main image
      // const updateImages = await ArticleImage.findAll({ where: { ArticleId: articleId, show: true } })
      // for (i = 0; updateImages.length > i; i++) {
      //   if (updateImages[i].articleImageId !== mainImage) {
      //     await updateImages[i].update({ mainImage: false })
      //   } else {
      //     await updateImages[i].update({ mainImage: true })
      //   }
      // }

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
  }
}


module.exports = articleController