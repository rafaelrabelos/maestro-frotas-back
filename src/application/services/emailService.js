const EmailAdapter = require('../../infra/adapters/emailAdapter');

async function SendRecoverEmail(user, code) {

  console.log(`======> ${code}`);
  // TODO implementar o adpter de email

  return EmailAdapter.Send(user.email, code);
}
module.exports = { SendRecoverEmail };
