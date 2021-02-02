const db = require('../models')
const fs = require('fs')
const path = require('path')
const { File } = db
const { v4: uuidv4 } = require('uuid')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

let fileController = {

  downloadFile: async (req, res) => {
    try {
      const file = await File.findOne({ where: { fileId: req.params.fileId } })

      const data = path.join(__dirname, '..', file.url)
      let binaryData = fs.readFileSync(data)
      let base64String = new Buffer.from(binaryData).toString("base64")

      return res.json({
        message: '成功下載檔案',
        result: {
          title: file.title,
          extension: file.url.split('.')[1],
          file: base64String
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  preloadFiles: async (req, res) => {
    try {

      let reg = []
      let plan = ''
      let training = ''

      const preload = await File.findAll({
        where: {
          show: true,
          category: {
            [Op.ne]: 'certification'
          }
        }
      })

      preload.forEach(file => {
        if (file.category === 'registration') {
          reg.push({ ...file.dataValues, extension: file.url.split('.')[1] })
        }

        if (file.category === 'plan') {
          plan = { ...file.dataValues, extension: file.url.split('.')[1] }
        }

        if (file.category === 'training') {
          training = { ...file.dataValues, extension: file.url.split('.')[1] }
        }
      });

      return res.json({
        message: '成功獲得檔案',
        result: {
          files: { reg, plan, training }
        }
      })

    } catch (err) {
      console.log(err)
    }
  },
  getAllFiles: async (req, res) => {
    try {
      const files = await File.findAll({
        where: { category: req.params.category, show: true },
        attributes: ['fileId', 'title', 'category', 'sort', 'updatedAt'],
        order: [['updatedAt', 'DESC']],
      })

      return res.json({
        message: '成功獲得檔案',
        result: {
          files: files
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  backGetAllfiles: async (req, res) => {
    try {
      const count = Number(req.query.count) || 10
      const page = Number(req.query.page) || 1

      const files = await File.findAndCountAll({
        where: { category: req.params.category, show: true },
        attributes: ['fileId', 'title', 'url', 'category', 'sort', 'updatedAt'],
        order: [['updatedAt', 'DESC']],
        limit: count,
        offset: (page - 1) * count,
      })

      return res.json({
        message: '成功獲得檔案',
        result: {
          pagination: {
            page,
            count,
            totalCount: files.count,
            totalPage: Math.ceil(files.count / count)
          },
          files: files.rows
        }
      })


    } catch (err) {
      console.log(err)
    }
  },

  createFile: async (req, res) => {
    try {
      const { category } = req.params
      const { title } = req.body
      const { file } = req

      if (!file) {
        return res.status(403).send({
          message: '請夾帶檔案',
          result: {}
        })
      }

      if (!title) {
        return res.status(403).send({
          message: '請輸入title',
          result: {}
        })
      }

      await File.create({
        fileId: uuidv4(),
        title,
        category,
        url: file.path,
        sort: await File.count({ where: { category } }) + 1,
      })

      return res.json({
        message: '成功新增檔案',
        result: {}
      })
    } catch (err) {
      console.log(err)
    }
  },
  editFile: async (req, res) => {
    try {
      const { title } = req.body
      const { category, fileId } = req.params
      const { file } = req

      if (!title) {
        return res.status(403).send({
          message: '請輸入Title',
          result: {}
        })
      }

      if (file) {
        if (category !== 'certification') {

          const oldFile = await File.findOne({ where: { category, fileId: fileId } })

          await oldFile.update({
            show: false
          })

          await File.create({
            fileId: uuidv4(),
            title,
            category,
            sort:
              await File.count({
                where: {
                  category,
                  url: { [Op.like]: '%' + file.originalname.split('.')[1] + '%' }
                }
              }) + 1,
            url: file.path
          })

          return res.json({
            message: '成功編輯檔案',
            result: {}
          })
        } else {
          //certification edit file
          const oldFile = await File.findOne({ where: { category, fileId } })

          await oldFile.update({
            title,
            url: file.path
          })

          return res.json({
            message: '成功編輯檔案',
            result: {}
          })
        }
      } else {
        //no file update
        const oldFile = await File.findOne({ where: { category, fileId } })

        await oldFile.update({
          title,
        })

        return res.json({
          message: '成功編輯檔案',
          result: {}
        })
      }


    } catch (err) {
      console.log(err)
    }
  },
  deleteFile: async (req, res) => {
    try {
      const file = await File.findOne({ where: { fileId: req.params.fileId } })

      await file.update({
        show: false
      })

      return res.json({
        message: '成功刪除檔案',
        result: {}
      })
    } catch (err) {
      console.log(err)
    }
  }

}


module.exports = fileController