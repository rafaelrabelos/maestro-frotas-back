const UsuarioRepository = require("../../infra/database/repository/UserRepository");


async function GetUsers(){

  var users = await UsuarioRepository.GetAll();
  return ValidateManyUser(users);
}

async function GetUserById(id){

  var user = await UsuarioRepository.GetById(id);

  return(ValidateSingleUser(user));
}

async function GetUserWithRolesById(id){

  var user = await UsuarioRepository.GetWithRolesById(id);
  return(ValidateSingleUser(user));
}


async function ValidateSingleUser(user){
  if(Array.isArray(user) && user.length == 1){
    return user[0];
  }

  return null;
}

async function ValidateManyUser(users){
  if(Array.isArray(users) && users.length >= 0){
    return users;
  }

  return null;
}

module.exports = {GetUsers, GetUserById, GetUserWithRolesById}