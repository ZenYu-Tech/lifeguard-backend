const db = require('../models')
const { Video } = db
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

let videoController = {

  getAllVideos: async (req, res) => {
    try {
      const count = Number(req.query.count) || 10
      const page = Number(req.query.page) || 1

      const videos = await Video.findAndCountAll(
        {
          where: { show: true },
          order: [['updatedAt', 'DESC']],
          limit: Number(count),
          offset: (page - 1) * count,
        },
      )
      const dataWithPic = videos.rows.map(v => {
        const pic = path.join(__dirname, '..', v.imageUrl)
        let binaryData = fs.readFileSync(pic)
        let base64String = new Buffer.from(binaryData).toString("base64")
        return {
          videoId: v.videoId,
          title: v.title,
          embedIframe: v.embed,
          sort: v.sort,
          createdAt: v.createdAt,
          image: base64String
        }
      })

      const totalPage = Math.ceil(videos.count / count)

      return res.json({
        message: '成功取得影片資料',
        result: {
          pagination: {
            page,
            count,
            previous: page > 1
              ? `${process.env.DOMAIN}/video/?count=${count}&page=${page - 1}` : null,
            next: totalPage > page
              ? `${process.env.DOMAIN}/video/?count=${count}&page=${page + 1}` : null,
            totalCount: videos.count,
            totalPage
          },
          videos: dataWithPic
        }
      })

    } catch (err) {
      console.log(err)
    }
  },
  backGetAllVideos: async (req, res) => {
    try {
      const count = req.query.count || 10
      const page = req.query.page || 1
      const videos = await Video.findAndCountAll(
        {
          order: [['updatedAt', 'DESC']],
          limit: Number(count),
          offset: (page - 1) * count,
        },
      )
      const dataWithPic = videos.rows.map(v => {
        const pic = path.join(__dirname, '..', v.imageUrl)
        let binaryData = fs.readFileSync(pic)
        let base64String = new Buffer.from(binaryData).toString("base64")
        return {
          videoId: v.videoId,
          title: v.title,
          embedIframe: v.embed,
          show: v.show,
          sort: v.sort,
          createdAt: v.createdAt,
          image: base64String
        }
      })

      return res.json({
        message: '成功取得影片資料',
        result: {
          pagination: {
            page,
            count,
            totalCount: videos.count,
            totalPage: Math.ceil(videos.count / count)
          },
          videos: dataWithPic
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  createVideo: async (req, res) => {
    try {
      const { title, embedIframe } = req.body

      if (!title) {
        return res.status(403).send({
          message: '請輸入Title',
          result: {}
        })
      }
      if (!embedIframe) {
        return res.status(403).send({
          message: '請輸入iframe',
          result: {}
        })
      }

      await Video.create({
        videoId: uuidv4(),
        title,
        embed: embedIframe,
        sort: await Video.count() + 1,
      })

      return res.json({
        message: '成功新增影片',
        result: {}
      })

    } catch (err) {
      console.log(err)
    }
  },
  editVideo: async (req, res) => {
    try {
      const { title, embedIframe } = req.body

      if (!title) {
        return res.status(403).send({
          message: '請輸入Title',
          result: {}
        })
      }
      if (!embedIframe) {
        return res.status(403).send({
          message: '請輸入iframe',
          result: {}
        })
      }

      const video = await Video.findOne({ where: { videoId: req.params.videoId } })

      await video.update({
        title,
        embed: embedIframe,
      })

      return res.json({
        message: '成功編輯影片',
        result: {}
      })

    } catch (err) {
      console.log(err)
    }
  },
  deleteVideo: async (req, res) => {
    try {
      const video = await Video.findOne({ where: { videoId: req.params.videoId } })

      await video.update({
        show: false
      })
      return res.json({
        message: '成功刪除影片',
        result: {}
      })

    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = videoController