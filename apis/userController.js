require('dotenv').config()
const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

let userController = {
  signIn: async (req, res) => {
    try {
      const name = req.body.name
      const password = req.body.password

      if (!name) {
        return res.status(403).send({
          message: '請輸入name',
          result: {}
        })
      }

      if (!password) {
        return res.status(403).send({
          message: '請輸入password',
          result: {}
        })
      }

      const user = await User.findOne({ where: { name: name } })

      if (!user) {
        return res.status(401).json({ status: 'error', message: '使用者名稱錯誤' })
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤' })
      }

      // 簽發 token
      var payload = { id: user.userId }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        message: '成功獲得token',
        result: {
          token: token,
          user: { userId: user.userId, name: user.name }
        }
      })

    } catch (err) {
      console.log(err)
    }
  }

}


module.exports = userController