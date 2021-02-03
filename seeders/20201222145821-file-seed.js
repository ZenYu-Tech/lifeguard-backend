'use strict'
const { v4: uuidv4 } = require('uuid')

let array = [
  'upload/file/registration/test.doc',
  'upload/file/registration/test.pdf',
  'upload/file/registration/test.odt',
  'upload/file/plan/default.pdf',
  'upload/file/training/default.pdf'
]

// let category = ['certification', 'plan', 'training']


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Files',
      Array.from({ length: 10 }).map((item, index) => {

        // const randomIndex = Math.floor(Math.random() * 3)

        const url = index > 4
          ? 'upload/file/certification/default.pdf'
          : array[index]
        return {
          fileId: uuidv4(),
          category: index > 4
            ? url.split('/')[2]
            : url.split('/')[2],
          title: index > 4
            ? url.split('/')[2]
            : url.split('/')[2] + '_title',
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
