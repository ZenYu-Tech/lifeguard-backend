const db = require('../models')
const fs = require('fs')
const path = require('path')
const { Video } = db

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

      res.json(dataWithPic)

    } catch (err) {
      console.log(err)
    }

  }
}

module.exports = videoController