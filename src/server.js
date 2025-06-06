const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser'); 
const path = require('path'); 

const authRoutes = require('./routes/web/auth.routes');
const rutaPacientes = require('./routes/api/pacientes.route.js');
const rutaWeb = require('./routes/web/pacientes.route.js');

class Server {
  constructor (template=process.env.TEMPLATE || 'ejs') {
    this.app = express()
    this.port = process.env.PORT || 3001
    this.middleware()
    //this.cors()
    this.engine(template)
    this.rutas()    
  }

  engine (template) {
     try{
       require.resolve(template);        
       this.app.set('view engine', template)
       this.app.set('views', './src/views/'+template)
     }catch (error) {
        console.log('Error al configurar el motor de plantillas:',template)        
      }
  }

  middleware () {       
    
    this.app.use(express.static(path.join(__dirname, 'public'))); 

    this.app.use(express.json())

    this.app.use(express.urlencoded({ extended: true })); 

    this.app.use(morgan('dev'))  
    
    this.app.use(cookieParser());   
    
    // Ajustes de sesion para presentar mensajes flash (Usuario borrado, por ej)
    this.app.use(session({
      secret: process.env.SECRETE_WORD,
      resave: false,
      saveUninitialized: true
    }));

    // Flash middleware
    this.app.use(flash());

    // Acá de hace disponible el servicio de mensajes para views
    this.app.use((req, res, next) => {
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('error');
      next();
    });
  }

  rutas () {  
    this.app.use('/api/v1/pacientes', rutaPacientes)

    this.app.use('/', authRoutes);
    
    this.app.use('/pacientes', rutaWeb);  

    this. app.use((req, res) => { res.status(404).render('not-found');});
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log(
        `Server running on port ${this.port}, host: ${process.env.HOST}:${this.port}`
      )
    })
  }
}

module.exports = Server
