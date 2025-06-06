const {getPacientesModel, 
  validate, 
  getPacienteByIdModel, 
  createPacienteModel, 
  deletePacienteModel, 
  getPacienteByEmail, 
  updatePacienteModel} = require('../../models/sqlite/paciente.model');

// Página para ingresar el login
const loginPage = (req, res) => {
  res.render('login', { 
    error: null, 
    title: 'Login - Clínica Salud+', 
    message: 'Clínica Salud+' 
  });
};

// Proceso tras el ingreso del login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await validate(email, password);
    res.cookie('token', token);  // store token in browser cookie
    res.redirect('/pacientes');  
  } catch (err) {
    res.render('login', { 
      error: 'Usuario / password incorrecto/s', 
      title: 'Login - Clínica Salud+',
      message: 'Por favor, inténtalo de nuevo' 
    });
  }
};

// Render de la lista de pacientes
const list = async (req, res) => {
  try {
    const pacientes = await getPacientesModel();    
    const title = 'Listado de pacientes';
    res.render('pacientes', { pacientes, title });  
  } catch (error) {
    res.status(500).send('Error al obtener pacientes');
  }
};

// Render de un único paciente
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await getPacienteByIdModel(id);
    const title = 'Paciente';   

    if (!paciente) {
      return res.status(404).render('not-found', { 
      });
    }
    res.render('paciente-detail', { paciente, title });
  } catch (error) {
    res.status(500).send('Error al obtener el paciente');
  }
};

// Formulario para crear un paciente
const renderCreatePacienteForm = (req, res) => {
  let paciente = {};
  const rawPaciente = req.flash('paciente')[0];

  try {
    if (rawPaciente) {
      paciente = JSON.parse(rawPaciente);
    }
  } catch (e) {
    paciente = {};
  }

  res.render('paciente-create', {
    title: 'Agregar Paciente - Clínica Salud+',
    paciente
    // **no need to pass error or success here** because available in res.locals
  });
};

// Procedimiento tras el POST del formulario para crear un paciente
const createPaciente = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      req.flash('error', 'Todos los campos son obligatorios.');
      req.flash('paciente', JSON.stringify({ name, email }));
      return res.redirect('/pacientes/create');
    }

    // Password length check
    if (password.length < 8) {
      req.flash('error', 'La contraseña debe tener al menos 8 caracteres.');
      req.flash('paciente', JSON.stringify({ name, email }));
      return res.redirect('/pacientes/create');
    }

    // Check if email already exists
    const existing = await getPacienteByEmail(email);
    if (existing) {
      req.flash('error', 'Ya existe un paciente con ese email.');
      req.flash('paciente', JSON.stringify({ name, email }));
      return res.redirect('/pacientes/create');
    }

    await createPacienteModel({ name, email, password });
    req.flash('success', 'Paciente creado correctamente.');
    return res.redirect('/pacientes');

  } catch (error) {
    req.flash('error', 'Error al crear paciente: ' + error.message);
    req.flash('paciente', JSON.stringify({ name, email }));
    return res.redirect('/pacientes/create');
  }
};

// DELETE paciente
const deletePaciente = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deletePacienteModel(id);
    if (!result) {
      req.flash('error', 'Paciente no encontrado.');
      return res.redirect('/pacientes');
    }
    
    // Success message on deletion
    req.flash('success', 'Paciente eliminado correctamente.');
    res.redirect('/pacientes');

    res.redirect('/pacientes');
    
  } catch (error) {
    req.flash('error', 'Error al eliminar el paciente: ' + error.message);
    res.redirect('/pacientes');
  }
};

// Formulario para editar el paciente
const getEditPacienteForm = async (req, res) => {
  const { id } = req.params;
  const paciente = await getPacienteByIdModel(id);
  if (!paciente) {
    req.flash('error', 'Paciente no encontrado');
    return res.redirect('/pacientes');
  }
  
  res.render('edit-paciente', {
    title: 'Editar Paciente',
    paciente
  });
};

// Proceso para manejar el POST de edicion de un paciente
const updatePacienteController = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email) {
    req.flash('error', 'Nombre y correo electrónico son obligatorios.');
    return res.redirect(`/pacientes/${id}/edit`);
  }

  // Validate password length if provided
  if (password && password.length > 0 && password.length < 8) {
    req.flash('error', 'La contraseña debe tener al menos 8 caracteres.');
    return res.redirect(`/pacientes/${id}/edit`);
  }

  // Check if the new email already belongs to a different patient
  const existing = await getPacienteByEmail(email);
  if (existing && existing.id != id) {
    req.flash('error', 'No puede usar ese email porque pertenece a otro paciente.');
    return res.redirect(`/pacientes/${id}/edit`);
  }

  const data = { name, email };
  if (password && password.length > 0) {
    data.password = password;
  }

  const updated = await updatePacienteModel(id, data);
  if (!updated) {
    req.flash('error', 'No se pudo actualizar el paciente');
    return res.redirect('/pacientes');
  }

  req.flash('success', 'Paciente actualizado con éxito');
  res.redirect('/pacientes');
};


module.exports = { 
  list, 
  loginPage, 
  login, 
  getById,
  renderCreatePacienteForm,
  createPaciente,  
  deletePaciente,
  getEditPacienteForm,
  updatePacienteController       
 };