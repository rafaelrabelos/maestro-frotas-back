const UserService = require("../../application/services/UserService");
const jwt = require("../../application/midleware/jwt");

async function secureRoute(req, res, validators, _next) {
  if (jwt.valideAuthJWT(req, res) === true) {
    req.decodedJWT = jwt.decodeJWT(req.headers.authorization);

    if (validators) {
      const checAthorizedResult = await checkUserRights(req, validators);

      if (checAthorizedResult === true) {
        return _next(req, res);
      }
      return res
        .status(401)
        .send({ status: false, erros: [checAthorizedResult] });
    } else {
      return _next(req, res);
    }
  }
}

async function checkUserRights(req, rights) {
  const userId = req.decodedJWT.id;

  if (userId === undefined || userId === "") {
    return `Usuário não identificado.`;
  } else {

    const user = await UserService.GetUserWithRolesById(userId);

    if (rights.root != undefined && rights.root && !isRoot(req, user)) {
      return `${user.nome}<${user.email}> sem privilégios root para executar esta ação.`;
    }
    if (rights.admin != undefined && rights.admin && !isAdmin(req, user)) {
      return `${user.nome}<${user.email}> sem privilégios admim para executar esta ação.`;
    }
    if (rights.owner != undefined && rights.owner && !isUserOwner(req, user)) {
      return `${user.nome}<${user.email}> sem privilégios owner para executar esta ação.`;
    }
    if (
      rights.system != undefined &&
      rights.system &&
      !isUserSystem(req, user)
    ) {
      return `${user.nome}<${user.email}> sem privilégios owner para executar esta ação.`;
    }
  }

  return true;
}

function isRoot(req, user) {
  return user.is_root  === 1;
}

function isAdmin(req, user) {
  if (isRoot(req, user) || user.is_adm === 1) {
    return true;
  }

  return false;
}

function isUserOwner(req, user) {
  if (
    isAdmin(req, user) || (req.params && req.params.usuarioId &&
    req.params.usuarioId.toString() === user.id.toString())
  ) {
    return true;
  }

  return false;
}

function isUserSystem(req, user) {
  if (isAdmin(req, user) || user.is_sys  === 1) {
    return true;
  }

  return false;
}

module.exports = { secureRoute, checkUserRights, isRoot, isAdmin, isUserOwner };
