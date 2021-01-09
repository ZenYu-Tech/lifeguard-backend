const db = require('../models')
const fs = require('fs')
const path = require('path')
const { File } = db
const { v4: uuidv4 } = require('uuid')

let fileController = {

  downloadFile: async (req, res) => {
    try {
      const file = await File.findOne({ where: { fileId: req.params.fileId } })
      const data = path.join(__dirname, '..', file.url)

      let binaryData = fs.readFileSync(data)
      let base64String = new Buffer.from(binaryData).toString("base64")
      res.json(base64String)
    } catch (err) {
      console.log(err)
    }
  },
  getAllFiles: async (req, res) => {
    try {
      const files = await File.findAll({
        where: { category: req.params.category, show: true },
        attributes: ['fileId', 'title', 'category', 'sort'],
        order: ['sort'],
      })

      res.json(files)
    } catch (err) {
      console.log(err)
    }
  },
  backGetAllfiles: async (req, res) => {
    try {
      const count = req.query.count || 10
      const page = req.query.page || 1

      const files = await File.findAndCountAll({
        where: { category: req.params.category },
        attributes: ['fileId', 'title', 'url', 'category', 'createdAt', 'sort'],
        order: ['sort'],
        limit: Number(count),
        offset: (page - 1) * count,
      })

      res.json({ 'total': files.count, 'files': files.rows })
    } catch (err) {
      console.log(err)
    }
  },

  createFile: async (req, res) => {
    try {
      const { category } = req.params
      const { file } = req

      await File.create({
        fileId: uuidv4(),
        title: req.body.title,
        category: category,
        url: file.path,
        sort: await File.count({ where: { category: category } }) + 1,
      })

      return res.json({
        status: 'success',
        message: 'create file successfully'
      })
    } catch (err) {
      console.log(err)
    }
  },
  editFile: async (req, res) => {
    try {
      const { file } = req

      if (file) {
        const theFile = await File.findOne({ where: { fileId: req.params.fileId } })

        const delPath = path.join(__dirname, '..', theFile.url)
        fs.unlinkSync(delPath)

        await theFile.update({
          title: req.body.title,
          url: file.path
        })

        return res.json({
          status: 'success',
          message: 'edit file successfully'
        })
      } else {
        const theFile = await File.findOne({ where: { fileId: req.params.fileId } })

        await theFile.update({
          title: req.body.title,
        })

        return res.json({
          status: 'success',
          message: 'edit file successfully'
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
        status: 'success',
        message: 'delete file successfully'
      })
    } catch (err) {
      console.log(err)
    }
  }

}


module.exports = fileController