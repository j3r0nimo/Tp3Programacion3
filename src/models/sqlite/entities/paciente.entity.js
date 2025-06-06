const { DataTypes } = require('sequelize');
const {sequelize} = require('./../config/db.js');

const Paciente = sequelize.define('Paciente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  //email: DataTypes.STRING, // Se actualiza para validar el campo
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: DataTypes.STRING
});

module.exports = {Paciente};