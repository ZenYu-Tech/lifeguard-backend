const db = require('../models')
const fs = require('fs')
const path = require('path')
const { File } = db

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
      const files = await File.findAll({ where: { category: req.params.category } })
      const data = files.map(f => {
        return { fileId: f.fileId, title: f.title, category: f.category }
      })
      res.json(data)
    } catch (err) {
      console.log(err)
    }
  }
}


module.exports = fileController