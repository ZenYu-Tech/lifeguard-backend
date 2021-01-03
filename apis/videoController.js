const db = require('../models')
const fs = require('fs')
const path = require('path')
const { Video } = db

let videoController = {

  getAllVideos: async (req, res) => {
    try {
      const videos = await Video.findAll()

      const dataWithPic = videos.map(v => {
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