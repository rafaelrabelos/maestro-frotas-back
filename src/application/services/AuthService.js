const bcrypt = require("bcrypt");
const validations = require('../../util/libs/validations');
const UserRepository = require("../../infra/database/repository/UserRepository");

async function AutheticateUser(cpf = '', pass = ''){
  
  const validaInput = await ValideLoginInputData(cpf, pass);
  var user = null;

  if(typeof user === 'string'){
    return({errorMessage: validaInput});
  }

  user = await UserRepository.GetWithRolesByCpf(cpf);
  user = await ValideLoginUser(user, pass);

  if(typeof user === 'string'){
    return({errorMessage: user});
  }

  user.type = user.is_root
        ? "root" : user.is_adm
        ? "admin" : user.is_sys
        ? "sys" : "user";
  
  return user;
}

async function ValideLoginUser(user = [], pass){

  if (!user || user.length !== 1){
    return(`Dados não encontrados para o usuário informado.`);
  }

  var user = user[0];

  if (!user.senha) {
    return("dados de validação não retornados pela base.");
  }

  if (!(await bcrypt.compare(pass, user.senha))) {
    return ("A senha informada é inválida.");
  }

  user.senha = undefined;

  return user;
}

async function ValideLoginInputData(cpf, senha){

  if (!cpf || !senha) {
    return("CPF e Senha devem ser informado.");
  }
  if(!validations.validateCpf(cpf)){
    return("CPF inválido informado.");
  }
  return true;
}

module.exports = {AutheticateUser}