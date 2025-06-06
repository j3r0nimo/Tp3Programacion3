const jwt = require("jsonwebtoken");
const Config = require("./../config/config.js");

const verifyTokenMiddleware = (req, res, next) => {
  let token;

  // Check Authorization header (e.g., from Postman or API client)
  const authHeader = req.header('Authorization') || req.header('authorization');
  if (authHeader) {
    token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;
  }

  // Fallback: check for token in cookie
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token found
  if (!token) {
    return res.status(401).json({ message: "Token de acceso no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, Config.secreteWord);
    req.user = decoded; // Attach payload to request
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = {
  verifyTokenMiddleware,
};