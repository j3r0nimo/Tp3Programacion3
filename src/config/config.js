const dotenv = require('dotenv');

dotenv.config()

class Config {                                          // MODIFICACION: Se verifican variables
  constructor() {
    if (!process.env.SECRETE_WORD) {
      throw new Error("Falta una variable: SECRETE_WORD");
    }
    if (!process.env.EXPIRES_IN) {
      throw new Error("Falta una variable: EXPIRES_IN");
    }

    this.secreteWord= process.env.SECRETE_WORD;
    this.expiresIn = process.env.EXPIRES_IN;
  }
}

module.exports = new Config();
