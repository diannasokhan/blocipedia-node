'use strict';
const faker = require("faker");

let wikis = [];
for(let i = 1; i <= 15; i++){
  wikis.push({
    title: faker.hacker.noun(),
     body: faker.lorem.sentence(),
     private: faker.random.boolean(),
     userId: 1,
     createdAt: new Date(),
     updatedAt: new Date()
  })
}
module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert("Wikis", wikis, {})
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete("Wikis", null, {})
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
