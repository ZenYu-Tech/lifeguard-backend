const express = require('express')
const router = express.Router()
const userController = require('../../apis/userController')
// const path = require('path')

// const userController = require('../apis/userController')
// const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })

router.post('/signin', userController.signIn)


module.exports = router