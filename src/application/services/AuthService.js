const bcrypt = require("bcrypt");
const validations = require("../../util/libs/validations");
const UserRepository = require("../../infra/database/repository/UserRepository");
const EmailService = require("./emailService");

async function AutheticateUser(cpf = "", pass = "") {
  const valideInput = await ValideLoginInputData(cpf, pass);
  var user = null;

  if (typeof valideInput === "string") {
    return { errorMessage: valideInput };
  }

  user = await UserRepository.GetWithRolesByCpf(cpf);
  user = await ValideLoginUser(user, pass);

  if (typeof user === "string") {
    return { errorMessage: user };
  }

  user.type = user.is_root
    ? "root"
    : user.is_adm
    ? "admin"
    : user.is_sys
    ? "sys"
    : "user";

  return user;
}

async function RecoverUserPassWord(cpf = "", code = "") {
  const valideInput = await ValideRecoverInputData(cpf, code);
  var user = null;

  if (typeof valideInput === "string") {
    return { errorMessage: validaInput };
  }

  if (await ValideRecoverCode(cpf, code)) {
    return { status: true, valid_code: true };
  }

  user = await UserRepository.GetByCpf(cpf);
  var userCode = await GenerateRecoverCode(cpf);

  const SendStatus = await EmailService.SendRecoverEmail(userCode, userCode.code);

  if (!SendStatus) {
    return { errorMessage: "erro ao enviar email" };
  }

  return { status: true, sent_email: userCode.email, vality: userCode.valid_date };
}

async function ValideLoginUser(user = [], pass) {
  if (!user || user.length !== 1) {
    return `Dados não encontrados para o usuário informado.`;
  }

  var user = user[0];

  if (!user.senha) {
    return "dados de validação não retornados pela base.";
  }

  if (!(await bcrypt.compare(pass, user.senha))) {
    return "A senha informada é inválida.";
  }

  user.senha = undefined;

  return user;
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

async function ValideRecoverCode(cpf, code) {
  userCode = await UserRepository.GetRecoverCodeByCpf(cpf, false);

  if (userCode == code) {
    return true;
  }

  return false;
}

async function GenerateRecoverCode(cpf) {

  userCode = await UserRepository.GetRecoverCodeByCpf(cpf);

  if(Array.isArray(userCode) && userCode.length > 0){
    userCode = userCode[0];
    return ValideRecoverCode(cpf, userCode.code) ? userCode : null;
  }
}

module.exports = { AutheticateUser, RecoverUserPassWord };
