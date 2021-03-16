const express = require('express')
const router = express.Router()
const userController = require('../../apis/userController')

const passport = require('../../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

router.post('/signin', userController.signIn)
router.put('/edit', authenticated, userController.editUser)


module.exports = router