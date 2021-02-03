const express = require('express')
const router = express.Router()
const userController = require('../../apis/userController')

router.post('/signin', userController.signIn)


module.exports = router