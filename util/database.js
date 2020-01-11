const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Pinksobe11', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;