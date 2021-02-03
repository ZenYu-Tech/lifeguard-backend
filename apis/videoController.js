const db = require('../models')
const { Video } = db
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
          attributes: ['videoId', 'title', 'embed', 'createdAt', 'sort', 'updatedAt'],
          order: [['updatedAt', 'DESC']],
          limit: count,
          offset: (page - 1) * count,
        },
      )

      const data = videos.rows.map(v => {
        return {
          videoId: v.videoId,
          title: v.title,
          embedIframe: v.embed,
          sort: v.sort,
          createdAt: new Date(v.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false }),
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
              ? `${process.env.DOMAIN}/video?count=${count}&page=${page - 1}` : null,
            next: totalPage > page
              ? `${process.env.DOMAIN}/video?count=${count}&page=${page + 1}` : null,
            totalCount: videos.count,
            totalPage
          },
          videos: data
        }
      })

    } catch (err) {
      console.log(err)
    }
  },
  backGetAllVideos: async (req, res) => {
    try {
      const count = Number(req.query.count) || 10
      const page = Number(req.query.page) || 1
      const videos = await Video.findAndCountAll(
        {
          where: { show: true },
          attributes: ['videoId', 'title', 'embed', 'createdAt', 'sort', 'updatedAt'],
          order: [['updatedAt', 'DESC']],
          limit: count,
          offset: (page - 1) * count,
        },
      )

      const data = videos.rows.map(v => {
        return {
          videoId: v.videoId,
          title: v.title,
          embedIframe: v.embed,
          sort: v.sort,
          createdAt: new Date(v.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Taipei', hour12: false }),
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
          videos: data
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