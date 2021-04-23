const bcrypt = require("bcrypt");
const UsuarioRepository = require("../../infra/database/repository/UserRepository");


async function GetUsers(){

  var users = await UsuarioRepository.GetAll();

  if(users.erro) return { errorMessage: users.erro };

  return ValidateManyUser(users);
}

async function GetUserById(id){

  var user = await UsuarioRepository.GetById(id);

  if(user.erro) return { errorMessage: user.erro };

  return(ValidateSingleUser(user));
}

async function GetSysAdminUser(){

  var user = await UsuarioRepository.GetAdmin();

  if(user.erro) return { errorMessage: user.erro };

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

  if(newUser.erro) return { errorMessage: newUser.erro };

  return newUser;

}

async function GetUserWithRolesById(id){

  var user = await UsuarioRepository.GetWithRolesById(id);

  if(user.erro) return { errorMessage: user.erro };

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

module.exports = {GetUsers, GetUserById, GetSysAdminUser, CpfOrEmailExists, GetUserWithRolesById, CreateNewUser}