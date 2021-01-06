const express = require('express')
const router = express.Router()
const videoController = require('../../apis/videoController')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: './upload/video_image/',
  filename: function (req, file, cb) {
    const filename = file.originalname.split('.')
    cb(null, filename[0] + '-' + Date.now() + '.' + filename[1])
  }
})
const upload = multer({
  storage: storage
}).single('image')
// const userController = require('../apis/userController')
// const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })

router.get('/', videoController.backGetAllVideos)
router.post('/', upload, videoController.createVideo)
router.put('/:videoId', upload, videoController.editVideo)
router.delete('/:videoId', videoController.deleteVideo)

module.exports = router