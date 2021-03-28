
'use strict';

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
require('dotenv').config()

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);

    return queryInterface.bulkInsert('Users',
      Array.from({ length: 1 }).map((item, index) =>
      ({
        userId: uuidv4(),
        account: 'gephaa',
        password: hash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
