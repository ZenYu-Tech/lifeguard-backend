const express = require('express')
const router = express.Router()
const videoController = require('../../apis/videoController')
const multer = require('multer')
// const path = require('path')

// const userController = require('../apis/userController')
// const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })

router.get('/', videoController.backGetAllVideos)
router.post('/', videoController.createVideo)
router.put('/:videoId', videoController.editVideo)
router.delete('/:videoId', videoController.deleteVideo)

module.exports = router