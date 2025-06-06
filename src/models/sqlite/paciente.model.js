const { Paciente } = require('../sqlite/entities/paciente.entity');
const jwt = require('jsonwebtoken');
const Config = require('../../config/config');


// Verifica las credenciales y produce un JWT
const validate = async (email, password) => {
  const user = await Paciente.findOne({ where: { email, password } });
  if (!user) throw new Error('Invalid email or password');

  const payload = {
    userId: user.id,
    userEmail: user.email,
  };

  const token = jwt.sign(payload, Config.secreteWord, {
    expiresIn: Config.expiresIn,
  });

  return token;
};

// Render de todos los pacientes de la base de datos.
const getPacientesModel = async () => {
  try {
    const users = await Paciente.findAll();
    return users;
  } catch (error) {
    throw new Error('Error fetching pacientes: ' + error.message);
  }
};

// render de un único paciente
const getPacienteByIdModel = async (id) => {
  return await Paciente.findByPk(id);
};

// creacion de un paciente
const createPacienteModel = async (data) => {
  return await Paciente.create(data);
};

// DELETE de un paciente
const deletePacienteModel = async (id) => {
  const paciente = await Paciente.findByPk(id);
  if (!paciente) return null;
  await paciente.destroy();
  return true;
};

// Compara email provisto
const getPacienteByEmail = async (email) => {
  return await Paciente.findOne({ where: { email } });
};

// UPDATE de un paciente
const updatePacienteModel = async (id, data) => {
  const paciente = await Paciente.findByPk(id);
  if (!paciente) return null;
  return await paciente.update(data);
};

module.exports = {
  getPacientesModel,
  getPacienteByIdModel,
  createPacienteModel,
  deletePacienteModel,
  getPacienteByEmail,
  updatePacienteModel,
  validate
};
