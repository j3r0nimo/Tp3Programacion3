const {Router} = require('express');

const pacientesController = require('../../controllers/API/pacientes.controller.js');

const {verifyTokenMiddleware}  = require('../../middlewares/verifyToken.middleware.js');

const rutaPacientes = Router();

// List all patients - requires valid token
rutaPacientes.get('/',verifyTokenMiddleware,pacientesController.list);

// Login route (usually returns a token) - no token required here
rutaPacientes.post('/login',pacientesController.login)

// Create a new patient - requires valid token
rutaPacientes.post('/',verifyTokenMiddleware,pacientesController.create);

// Update a patient by ID - requires valid token
rutaPacientes.put('/:id',verifyTokenMiddleware,pacientesController.update);

// Delete a patient by ID - requires valid token
rutaPacientes.delete('/:id',verifyTokenMiddleware,pacientesController.delete);

//Otras rutas CRUD

// Get patient by ID - requires valid token
rutaPacientes.get('/:id',verifyTokenMiddleware,pacientesController.getById);         // GRUPO - AGREGADO

module.exports = rutaPacientes;
