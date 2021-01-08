const express = require('express')
const router = express.Router()
const videoController = require('../../apis/videoController')

//Front stage
router.get('/', videoController.getAllVideos)

module.exports = router