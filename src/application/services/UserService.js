const UsuarioRepository = require("../../infra/database/repository/UserRepository");


async function GetUsers(){

  var users = await UsuarioRepository.ObtemUsuarios();

  return users;

}

module.exports = {GetUsers}