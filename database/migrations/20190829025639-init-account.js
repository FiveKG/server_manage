'use strict';
//table:account
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   /*
   const { TEXT,INTEGER, DATE, STRING,DATETIME, } = Sequelize;
    await queryInterface.createTable('account', {
      account_id: { 
        type: TEXT(20), 
        primaryKey: true,
        defaultValue:'',
        comment:'',

       },
      name: STRING(30),
      age: INTEGER,
      created_at: DATE,
      updated_at: DATE,
    });
    */
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
