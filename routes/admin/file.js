const express = require('express')
const router = express.Router()
const fileController = require('../../apis/fileController')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./upload/file/${req.params.category}`)
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split('.')
    cb(null, filename[0] + '-' + Date.now() + '.' + filename[1])
  }
})
const upload = multer({
  storage: storage
}).single('file')
// const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })

//Front stage
router.get('/:category', fileController.backGetAllfiles)
router.post('/:category', upload, fileController.createFile)
router.put('/:category/:fileId', upload, fileController.editFile)
router.delete('/:category/:fileId', fileController.deleteFile)

module.exports = router