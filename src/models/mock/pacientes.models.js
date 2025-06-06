const Persona = require("./../mock/entities/paciente.entity.js");
const Config = require("./../../config/config.js");
const jwt = require("jsonwebtoken");

class PacientesModel {            // El paciente será una instancia de esta clase
  constructor() {
    this.data = [];               // Inicializa una matriz vacía para almacenar pacientes. Es la "tabla".  
    this.data.push(               // Agrega un paciente codificado (un objeto Persona)
      new Persona(
        "123456787",
        "Sergio",
        "Antozzi",
        "email@gmail.com",
        "12345",
        1
      )
    );
    this.id = 2;                  // Comienza el próximo ID en 2
  }

  // verifica si existe el usuario ingresado
  findByEmail(email, password) {
    return new Promise((resolve, reject) => {
      try {
        const paciente = this.data.find(
          (p) => p.email === email && p.password === password
        );               
       if (!paciente) { 
          throw new Error("el paciente no existe");
        }
        resolve(paciente);
      } catch (error) {
        reject(error);
      }
    });
  }

  // verifica el usuario y, si es válido, crea un token.
  validate(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const userFound = await this.findByEmail(email, password);

        if (!userFound || userFound.password == null) {
          throw new Error("wrong email or password");
        }

        //payload, secreto, tiempo de expiracion
        const payload = {
          userId: userFound._id,
          userEmail: userFound.email,
        };
        // console.log("palabra secreta, pacientes model:", Config.secreteWord);

        const token = jwt.sign(payload, Config.secreteWord, {
          expiresIn: Config.expiresIn,
        });
        resolve(token);        
      } catch (error) {
        reject(error);
      }
    });
  }

  
  // crear un dato nuevo (alta de paciente)           //TODO: verificar que no sea nulo si es nulo, devolver excepcion
  create(paciente) {                                    
      return new Promise((resolve, reject) => {       //retorna una instancia de la clase paciente;
      try{
        paciente.id = this.id;
        this.id++;

        // comprueba si hay duplicados por correo electrónico.
        const pacienteEncontrado = this.data.find(p=>p.email===paciente.email)
               
        if(!pacienteEncontrado){                      // GRUPO - CORRECCION (!pacienteEncontrado)
          this.data.push(paciente);
        }else{
          throw new Error("el paciente ya existe")
        }

        resolve(paciente);
      }catch(error){
        reject(error);
      } 
    });
  }
  
  // actualiza los datos del paciente
  update(id, paciente) {
    return new Promise((resolve,reject)=>{
      try {

         const pacienteEncontrado = this.data.find((p) => p.id == id);
      if (pacienteEncontrado===null) {
        throw new Error("No se encuntra el paciente");
      }
      pacienteEncontrado.dni = paciente.dni;
      pacienteEncontrado.email = paciente.email;
      pacienteEncontrado.nombre = paciente.nombre;
      pacienteEncontrado.apellido = paciente.apellido;
      resolve(pacienteEncontrado);
    } catch (error) {
      reject(error);
    }
    })
    
  }
 
  // elimina un paciente
  delete(id) {
    return new Promise((resolve, reject) => {             // GRUPO - CORRECCION (se agrega return)
      try {
        const pacienteEncontrado = this.data.find((p) => p.id == id);
        if (!pacienteEncontrado) {
          throw new Error("el id no es válido");
        }

        const pos = this.data.indexOf(pacienteEncontrado);
        this.data.splice(pos, 1);
        resolve(pacienteEncontrado); // Successfully deleted
      } catch (error) {
        reject(error);
      }
    });
  }

  // devuelve la lista completa de pacientes
  list() {
    return new Promise((resolve, reject) => {
      resolve(this.data);
    });
  }

  // retorna un unico paciente
  getPacienteById(id){                                                      // GRUPO - SE AGREGA METODO
     return new Promise((resolve,reject)=>{
       try{
         const identificador = Number(id);
         const pacienteEncontrado = this.data.find(paciente=>paciente.id === identificador)
       if(!pacienteEncontrado){
           throw new Error("el id es incorrecto");
       }
        resolve(pacienteEncontrado);
       }catch(error){
         reject(error)
       }
      
     })
  }
}

module.exports = new PacientesModel();