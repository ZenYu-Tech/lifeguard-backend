'use strict'
const { v4: uuidv4 } = require('uuid')

let array = [
  'upload/file/registration/test.doc',
  'upload/file/registration/test.pdf',
  'upload/file/registration/test.odt'
]

let category = ['certification', 'plan', 'training']


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Files',
      Array.from({ length: 10 }).map((item, index) => {

        const randomIndex = Math.floor(Math.random() * 3)

        const url = index > 2
          ? `upload/file/${category[randomIndex]}/default.pdf`
          : array[index]
        const extension = url.split('.')[1]
        const title = url.split('/')[2] + '.' + extension
        return {
          fileId: uuidv4(),
          category: index > 2
            ? category[randomIndex]
            : 'registration',
          title,
          url,
          sort: index + 1,
          show: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Files', null, {})
  }
}
