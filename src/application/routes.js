const express = require("express");
const secure = require("../util/libs/secure");
const AuthController = require("./controllers/AuthController");
const UserController = require("./controllers/UserController");
const os = require("os");

const routes = express.Router();

const appInfo = {
  info: {
    apiName: "Maestro frotas",
    apiHost: os.hostname() || "Não indefificado",
    apiEndpoints: ["/api"],
    apiVer: "v1",
    apiPort: process.env.API_PORT || "Não indefificado",
  },
  createdBy: [
    "Grupo LABORATÓRIO DE DESENVOLVIMENTO DE SISTEMAS DE INFORMAÇÃO"
  ],
}

routes.get("/", (req, res) => 
secure.secureRouteForUntrustedOrigin(req, res, (req, res) => res.status(200).send(appInfo))
);

// Auth
routes.post("/auth/login", (req, res) =>
  secure.secureRouteForUntrustedOrigin(req, res, AuthController.Auth)
);
routes.post("/auth/recovery/send-info", (req, res) => 
  secure.secureRouteForUntrustedOrigin(req, res, AuthController.SendRecoveryInfo)
);
routes.post("/auth/recovery/validate-code", (req, res) => 
  secure.secureRouteForUntrustedOrigin(req, res, AuthController.ValidateRecoveryCode)
);
routes.post("/auth/recovery/set-password", (req, res) => 
  secure.secureRouteForUntrustedOrigin(req, res, AuthController.SetNewPassword)
);

// Users
routes.get("/user", (req, res) =>
  secure.secureRoute(req, res, null, UserController.getSelfUser)
);
routes.get("/user/todos", (req, res) =>
  secure.secureRoute(req, res, { admin: true }, UserController.getUsers)
);
routes.get("/user/:usuarioId", (req, res) =>
  secure.secureRoute(req, res, null, UserController.getUser)
);
routes.get("/user/:usuarioId/pets", (req, res) =>
  secure.secureRoute(req, res, null, UserController.getUserPets)
);
routes.post("/user/register", (req, res) =>
  secure.secureRoute(req, res, { system: true }, UserController.createUser)
);
routes.put("/user", (req, res) =>
  secure.secureRoute(req, res, null, UserController.updateSelfUser)
);
routes.put("/user/:usuarioId", (req, res) =>
  secure.secureRoute(req, res, { owner: true }, UserController.updateUser)
);
routes.delete("/user/:usuarioId", (req, res) =>
  secure.secureRoute(req, res, { system: true  }, UserController.deleteUser)
);


module.exports = routes;
