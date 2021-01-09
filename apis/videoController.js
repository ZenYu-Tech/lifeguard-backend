const db = require('../models')
const { Video } = db
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')


let videoController = {

  getAllVideos: async (req, res) => {
    try {
      const count = req.query.count || 10
      const page = req.query.page || 1
      const videos = await Video.findAndCountAll(
        {
          where: { show: true },
          order: ['sort'],
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
          videoUrl: v.videoUrl,
          sort: v.sort,
          createdAt: v.createdAt,
          image: base64String
        }
      })

      res.json({
        'total': videos.count,
        'videos': dataWithPic
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
          order: ['sort'],
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
          videoUrl: v.videoUrl,
          show: v.show,
          sort: v.sort,
          createdAt: v.createdAt,
          image: base64String
        }
      })

      res.json({
        'total': videos.count,
        'videos': dataWithPic
      })
    } catch (err) {
      console.log(err)
    }
  },
  createVideo: async (req, res) => {
    try {
      const { title, url } = req.body
      const { file } = req

      await Video.create({
        videoId: uuidv4(),
        title,
        videoUrl: url,
        imageUrl: file.path,
        sort: await Video.count() + 1,
      })

      return res.json({
        status: 'success',
        message: 'create video successfully'
      })

    } catch (err) {
      console.log(err)
    }
  },
  editVideo: async (req, res) => {
    try {
      const { title, url } = req.body
      const { file } = req

      if (file) {
        const video = await Video.findOne({ where: { videoId: req.params.videoId } })

        const delPath = path.join(__dirname, '..', video.imageUrl)
        fs.unlinkSync(delPath)

        await video.update({
          title,
          videoUrl: url,
          imageUrl: file.path,
        })

        return res.json({
          status: 'success',
          message: 'edit video successfully'
        })

      } else {
        const video = await Video.findOne({ where: { videoId: req.params.videoId } })

        await video.update({
          title,
          videoUrl: url,
        })

        return res.json({
          status: 'success',
          message: 'edit video successfully'
        })
      }
    } catch (err) {
      console.log(err)
    }
  },
  deleteVideo: async (req, res) => {
    try {
      const video = await video.findOne({ where: { videoId: req.params.videoId } })

      await video.update({
        show: false
      })

      return res.json({
        status: 'success',
        message: 'delete video successfully'
      })

    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = videoController