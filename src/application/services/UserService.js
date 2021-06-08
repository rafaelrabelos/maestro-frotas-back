const bcrypt = require("bcrypt");
const UsuarioRepository = require("../../infra/database/repository/UserRepository");


async function GetUsers(){

  var users = await UsuarioRepository.GetAllUsers();

  return ValidateManyUser(users);
}

async function GetAdminUsers(){

  var users = await UsuarioRepository.GetAllAdmin();

  return ValidateManyUser(users);
}

async function GetRootUsers(){

  var users = await UsuarioRepository.GetAllRoot();

  return ValidateManyUser(users);
}

async function GetSysUsers(){

  var users = await UsuarioRepository.GetAllSys();

  return ValidateManyUser(users);
}

async function GetBasedOnRole(roleName){

  var users = await UsuarioRepository.GetBasedOnRole(roleName);

  return ValidateManyUser(users);
}

async function GetUserById(id){

  var user = await UsuarioRepository.GetById(id);

  return(ValidateSingleUser(user));
}

async function CpfOrEmailExists(cpf, email){

  var exists = await UsuarioRepository.UserCpfOrEmailExists(cpf.replace(/[^0-9]/g, ''), email);

  return(exists == 1);
}

async function CreateNewUser({cpf, nome, email, senha, criadoPor}){
  
  senha = await bcrypt.hash(senha, 10);
  cpf = cpf.replace(/[^0-9]/g, '');
  
  const newUser = await UsuarioRepository.InsertUser({cpf, nome, email, senha, criadoPor});

  return newUser;

}

async function GetUserWithRolesById(id){

  var user = await UsuarioRepository.GetWithRolesById(id);
  return(ValidateSingleUser(user));
}

async function UpdateUser(usuarioId, userData){

  var user = await UsuarioRepository.UpdateById(usuarioId, userData);

  return user.affectedRows === 1 ? GetUserWithRolesById(usuarioId) : user;

}

async function RemoveUser(usuarioId){ return []; }

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

module.exports = {
  GetUsers,
  GetAdminUsers,
  GetRootUsers,
  GetSysUsers,
  GetBasedOnRole,
  GetUserById, 
  CpfOrEmailExists, 
  GetUserWithRolesById, 
  CreateNewUser, 
  UpdateUser,
  RemoveUser
};