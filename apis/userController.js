require('dotenv').config()
const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let userController = {
  signIn: async (req, res) => {
    try {
      const account = req.body.account
      const password = req.body.password

      if (!account) {
        return res.status(401).send({
          message: '請輸入帳號',
          result: {}
        })
      }

      if (!password) {
        return res.status(401).send({
          message: '請輸入密碼',
          result: {}
        })
      }

      const user = await User.findOne({ where: { account: account } })

      if (!user) {
        return res.status(403).json({ message: '找不到您的帳號', result: {} })
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(403).json({ message: '密碼錯誤', result: {} })
      }

      // 簽發 token
      var payload = { id: user.userId }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        message: '登入成功！',
        result: {
          token: token,
          user: { userId: user.userId, account: user.account, role: user.role }
        }
      })

    } catch (err) {
      console.log(err)
    }
  },
  editUser: async (req, res) => {
    try {
      const userId = req.body.userId
      const account = req.body.account
      const oldPassword = req.body.oldPassword
      const newPassword = req.body.newPassword

      if (!account) {
        return res.status(403).send({
          message: '請輸入帳號',
          result: {}
        })
      }

      if (!oldPassword) {
        return res.status(403).send({
          message: '請輸入密碼',
          result: {}
        })
      }

      if (!newPassword) {
        return res.status(403).send({
          message: '請輸入新密碼',
          result: {}
        })
      }

      const user = await User.findOne({ where: { userId } })

      if (bcrypt.compareSync(oldPassword, user.password)) {

        await user.update({
          account,
          password: newPassword
        })

        return res.json({
          message: "User修改成功！",
          result: {}
        })

      } else {
        return res.status(401).json({ message: '密碼錯誤', result: {} })
      }

    } catch (err) {
      console.log(err)
    }


  }
}


module.exports = userController