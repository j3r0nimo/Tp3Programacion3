const {Router} = require('express');

const {home} = require('../../controllers/home/home.controller.js')

const rutaHome = Router();

rutaHome.get('/', home);

module.exports = rutaHome;