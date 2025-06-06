const {Router} = require('express');

const { list, 
  getById, 
  renderCreatePacienteForm, 
  createPaciente, 
  deletePaciente,
  getEditPacienteForm,
  updatePacienteController} = require('../../controllers/home/pacientes.controller');

const {verifyTokenMiddleware}  = require('../../middlewares/verifyToken.middleware.js');

const { getPacienteByIdModel } = require('../../models/sqlite/paciente.model.js');

const rutaWeb = Router();

// Ruta para mostrar el formulario de búsqueda de un paciente
rutaWeb.get('/search', verifyTokenMiddleware, (req, res) => {
  res.render('id-form', { title: 'Buscar Paciente' });
});

// Ruta para buscar el paciente provisto por el formulario de búsqueda
rutaWeb.post('/search', verifyTokenMiddleware, async (req, res) => {
  const id = req.body.id;
  const paciente = await getPacienteByIdModel(id);
  
  if (!paciente) {
    req.flash('error', 'No se encontró un paciente con ese ID.');
    return res.redirect('/pacientes/search');
  }

  res.redirect(`/pacientes/${id}`);
});

// Ruta para cerrar la sesión
rutaWeb.get('/logout', (req, res) => {
  res.clearCookie('token'); 
  req.flash('success', 'Has cerrado sesión correctamente.');
  res.redirect('/login');
});

// GET lista completa
rutaWeb.get('/', verifyTokenMiddleware, list);

// Formulario para crear paciente (GET)
rutaWeb.get('/create', verifyTokenMiddleware, renderCreatePacienteForm);

// Creacion del paciente nuevo provisto por el formulario (POST)
rutaWeb.post('/create', verifyTokenMiddleware, createPaciente);

// GET Paciente por su id
rutaWeb.get('/:id',verifyTokenMiddleware, getById);

// UPDATE paciente
rutaWeb.get('/:id/edit', verifyTokenMiddleware, getEditPacienteForm);
rutaWeb.post('/:id/edit', verifyTokenMiddleware, updatePacienteController);

// DELETE paciente por su id 
// HTML forms do not support the DELETE method
rutaWeb.post('/:id/delete', verifyTokenMiddleware, deletePaciente);

module.exports = rutaWeb;
