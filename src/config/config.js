const dotenv = require('dotenv');

dotenv.config()

class Config {                                          // MODIFICACION: Se verifican variables
  constructor() {
    if (!process.env.SESSION_SECRET) {
      throw new Error("Falta una variable: SESSION_SECRET");
    }
    if (!process.env.EXPIRES_IN) {
      throw new Error("Falta una variable: EXPIRES_IN");
    }

    this.secreteWord= process.env.SESSION_SECRET;
    this.expiresIn = process.env.EXPIRES_IN;
  }
}

module.exports = new Config();