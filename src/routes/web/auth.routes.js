
const { Router } = require('express');

const { loginPage, login } = require('../../controllers/home/pacientes.controller');

const authRoutes = Router();

authRoutes.get('/', loginPage);  

authRoutes.get('/login', (req, res) => res.redirect('/'));

authRoutes.post('/login', login); 

module.exports = authRoutes;