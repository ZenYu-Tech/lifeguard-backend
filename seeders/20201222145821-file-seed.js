'use strict'
const { v4: uuidv4 } = require('uuid')

let array = [
  'upload/file/registration/test.doc',
  'upload/file/registration/test.pdf',
  'upload/file/registration/test.odt'
]


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Files',
      Array.from({ length: 10 }).map((item, index) => {
        const url = index > 2
          ? array[0]
          : array[index]
        const title = url.split('/')[2]
        return {
          fileId: uuidv4(),
          category: index > 2
            ? 'certification'
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
