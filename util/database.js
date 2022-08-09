const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('store', 'root', 'Gbolahan57',{
    dialect:'mysql',
    host:'localhost'
});


module.exports = sequelize;