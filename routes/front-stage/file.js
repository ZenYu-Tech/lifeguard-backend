const express = require('express')
const router = express.Router()
const fileController = require('../../apis/fileController')

router.get('/preload', fileController.preloadFiles)
router.get('/download/:fileId', fileController.downloadFile)
router.get('/:category', fileController.getAllFiles)


module.exports = router