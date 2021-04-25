const UserService = require("../../application/services/UserService");
const SecureService = require('../../application/services/secureService');
const jwt = require("../../application/midleware/jwt");

async function secureRoute(req, res, validators, _next) {
  if (jwt.valideAuthJWT(req, res) === true) {
    req.decodedJWT = jwt.decodeJWT(req.headers.authorization);

    const { client_ip } = req.headers;
    const isUserNotAllowed = await isUserBlocked();
    const isOriginNotAllowed = await isOriginBlocked(client_ip);

    if(isUserNotAllowed || isOriginNotAllowed){
      return res
        .status(403)
        .send({ status: false, erros: ['Usuário/IP com bloqueio'] });
    }
    
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

async function secureRouteForUntrustedOrigin(req, res, _next){
  const { client_ip } = req.headers;
  const originData = await originInfo(client_ip);
  
  if(originData.blocked){
    return res
      .status(403)
      .send({ status: false, erros: originData.descriptions });
  }

  return _next(req, res);
}

async function originInfo(ip) {
  const policies = await SecureService.GetPoliciesByIP(ip);

  if(Array.isArray(policies) && policies.length > 0){
    const blocks = policies.filter( (policie) => policie.is_blocked );
    const descriptions = blocks.map( (block) => block.description);
    const blocked = blocks.length > 0;

    return { blocked, descriptions }
  }

  return false;
}

async function registerSuspeciousTrying(req){
  const { client_ip } = req.headers;
  const { cpf } = req.body;

  const policies = await SecureService.SyncSuspeciousTrying(client_ip, cpf);

  return 
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

module.exports = { secureRoute, secureRouteForUntrustedOrigin, registerSuspeciousTrying, checkUserRights, isRoot, isAdmin, isUserOwner };
