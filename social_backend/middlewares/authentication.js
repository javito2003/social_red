const jwt = require("jsonwebtoken");

let checkAuth = (req, res, next) => {
  let token = req.get("token");
  jwt.verify(token, "SECUREPASSWORDHERE", (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        mensaje: "Error de token",
        err,
      });
    }

    // Creamos una nueva propiedad con la info del usuario
    req.userData = decoded.userData; //data viene al generar el token en login.js
    next();
  });
};


module.exports = {checkAuth}