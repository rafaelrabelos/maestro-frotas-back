const UsuarioRepository = require("../../infra/database/repository/UsuarioRepository");


async function ObtemUsuarios(){

  var users = await UsuarioRepository.ObtemUsuarios();

  return users;

}

module.exports = {ObtemUsuarios}