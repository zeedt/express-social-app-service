'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  //  return queryInterface.addColumn(
  //   'users',
  //   'display_picture',
  //   Sequelize.STRING
  // );
  return queryInterface.addColumn(
    'posts',
    'attachments',
    Sequelize.TEXT
  );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
