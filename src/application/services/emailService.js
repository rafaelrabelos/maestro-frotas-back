const Mail = require('../../infra/adapters/emailAdapter');
const util = require('../../util/libs/datetime');

async function SendRecoveryEmail(user, code) {

  const from = {
    name: process.env.RECOVERY_PASS_NAME_FROM,
    email: process.env.RECOVERY_PASS_EMAIL_FROM
  }

  const to = {
    name: user.nome,
    email: user.email.replace(/[^a-zA-Z0-9@-_.]/gi, ''),//user.email
  }
  
  const message = {
    from: from,
    to: to ,
    subject: 'Recuperação de senha',
    message: `
    Foi solicitada a redefinição de senha para seu CPF/E-mail.
    Segue o seu código de recuperação. utilize-o para redefinir sua senha na pagina de recuperação`,
    body: "",
  }

  message.body = `Olá, <b>${message.to.name}</b>,<br/><br/>
  <p>${message.message}</P>
  <br/><br/>
  <p><b>${code}</b></P>
  <br/>
  <p>
  Criado em: ${util.dataTempoFormatada(user.created_at)}<br/>
  Valido até: ${util.dataTempoFormatada(user.valid_date)}<br/>
  </p>
  <p> Atenciosamente,<br/>
  Maestro Frotas.
  `;

  var resultAdapter = await Mail.defaultAdapter.Send(message);

  return resultAdapter;
}

module.exports = { SendRecoveryEmail };
