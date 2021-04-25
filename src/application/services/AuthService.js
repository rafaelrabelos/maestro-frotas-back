const bcrypt = require("bcrypt");
const validations = require("../../util/libs/validations");
const UserRepository = require("../../infra/database/repository/UserRepository");
const PoliciesRepository = require("../../infra/database/repository/PoliciesRepository");
const EmailService = require("./emailService");
const util = require('../../util/libs/datetime');

async function AutheticateUser(cpf = "", pass = "", req) {

  const valideInput = await ValideLoginInputData(cpf, pass);
  var user = null;

  if (typeof valideInput === "string") {
    return { errorMessage: valideInput };
  }

  user = await UserRepository.GetWithRolesByCpf(cpf.replace(/[^0-9]/g, ''));

  if(user.erro) return { errorMessage: user.erro };
  
  user = await ValideLoginUser(user, pass, req);

  if (typeof user === "string") return { errorMessage: user };

  user.type = user.is_root
    ? "root"
    : user.is_adm
    ? "admin"
    : user.is_sys
    ? "sys"
    : "user";

  return user;
}

async function ValideLoginUser(user = [], pass, req) {
  
  if (!user || user.length !== 1) {
    return `Dados não encontrados para o usuário informado.`;
  }

  const { client_ip } = req.headers;

  user = user[0];
  user.policies = (await PoliciesRepository.GetByUserIdAndIp(user.id, client_ip ))[0];
  console.log(user)
  if (user.policies && user.policies.is_blocked == 1) {
    return `Usuário temporariamente bloqueado`;
  }

  if (!user.senha) {
    return "dados de validação não retornados pela base.";
  }

  if (!(await bcrypt.compare(pass, user.senha))) {

    if(user.policies){
      return `
      A senha informada é inválida.
      ${user.policies.counter > 7? user.policies.description :''}
      `;
    }

    return `A senha informada é inválida.`
  }

  user.senha = undefined;

  return user;
}

async function SendRecoveryInfo(cpf = "") {
  const valideInput = await ValideRecoverInputData(cpf);

  if (typeof valideInput === "string") {
    return { errorMessage: valideInput };
  }
  
  var userData = await GenerateRecoverCode(cpf);

  if(userData && userData.code){
    const SendStatus = await EmailService.SendRecoverEmail(userData, userData.code);
    
    if (SendStatus.status){
      return { status: true, sent_email: userData.email, vality: util.dataTempoFormatada(userData.valid_date) };
    } else{
      return { errorMessage: SendStatus.ErrorMessage };
    }
  }else if(userData.erro){
    return { errorMessage: userData.erro };
  }else{
    return { errorMessage: "erro ao gerar código" };
  }
  
}

async function GenerateRecoverCode(cpf) {
  
  userCode = await UserRepository.GetRecoverCodeByCpf(cpf);

  if(userCode.erro) return userCode;

  if(Array.isArray(userCode) && userCode.length > 0){
    userCode = userCode[0];
    return await ValidateRecoveryCode(cpf, userCode.code) ? userCode : null;
  }
  return {}
}

async function ValidateRecoveryCode(cpf, code) {
  userCode = await UserRepository.GetRecoverCodeByCpf(cpf, false);

  if(userCode.erro) return { errorMessage: userCode.erro };

  if(Array.isArray(userCode) && userCode.length > 0){
    userCode = userCode[0];
  }

  if (userCode.code == code && userCode.code_is_valid == 1) {
    return { status: true, vality: true };
  }

  return { errorMessage: "O código informado é inválido ou expirou." };
}

async function SetNewPassword(cpf, code, pass){

  const validCode = await this.ValidateRecoveryCode(cpf, code);

  if(validCode.vality && validCode.status){

    user = await UserRepository.UpdatePasswordByCpf(cpf, pass);

    if(user.erro) return { errorMessage: user.erro };

    if(user && user.affectedRows == 1){
      return { status: true, afected: user.affectedRows, info: user.info };
    }
  }else if(validCode.errorMessage){
    return validCode;
  }else{
    return { errorMessage: "Código não é válido." };
  }
  
}

async function ValideLoginInputData(cpf, senha) {
  if (!cpf || !senha) {
    return "CPF e Senha devem ser informado.";
  }
  if (!validations.validateCpf(cpf)) {
    return "CPF inválido informado.";
  }
  return true;
}

async function ValideRecoverInputData(cpf, code) {
  if (!cpf) {
    return "CPF deve ser informado";
  }

  if (!cpf && !code) {
    return "Dados inválidos fornecidos";
  }

  if (!cpf && code) {
    return "Chamada inválida";
  }

  if (!validations.validateCpf(cpf)) {
    return "CPF inválido informado.";
  }

  return true;
}

module.exports = { AutheticateUser, SendRecoveryInfo, ValidateRecoveryCode, SetNewPassword };
