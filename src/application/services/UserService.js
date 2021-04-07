const UsuarioRepository = require("../../infra/database/repository/UserRepository");


async function GetUsers(){

  var users = await UsuarioRepository.GetAll();

  return users;

}

module.exports = {GetUsers}