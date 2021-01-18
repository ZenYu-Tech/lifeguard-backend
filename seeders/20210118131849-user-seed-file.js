
'use strict';

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
require('dotenv').config()

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log(process.env.ADMIN_PASSWORD, 'process.env.ADMIN_PASSWORD')



    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);

    // const ps = await bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),

    return queryInterface.bulkInsert('Users',
      Array.from({ length: 1 }).map((item, index) =>
        ({
          userId: uuidv4(),
          name: 'lifeguard2020',
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
