const express = require("express");
const secure = require("../util/libs/secure");
const LoginController = require("./controllers/LoginController");
const UserController = require("./controllers/UserController");
const os = require("os");

const routes = express.Router();

routes.get("/", (req, res) =>
  res.status(200).send({
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
  })
);

// Sessão e login
routes.post("/login", LoginController.autentica);

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
routes.post("/user", (req, res) =>
  secure.secureRoute(req, res, { system: true }, UserController.createUser)
);
routes.put("/user", (req, res) =>
  secure.secureRoute(req, res, null, UserController.updateUser)
);
routes.put("/user/:usuarioId", (req, res) =>
  secure.secureRoute(req, res, { owner: true }, UserController.updateUser)
);
routes.delete("/user/:usuarioId", (req, res) =>
  secure.secureRoute(req, res, { system: true }, UserController.deleteUser)
);

module.exports = routes;
