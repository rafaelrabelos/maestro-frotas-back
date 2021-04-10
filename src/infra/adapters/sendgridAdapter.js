const sgMail = require('@sendgrid/mail');

async function Send(message) {

  
  var response = {};
  const msg = {
    to: message.to.email,
    from: message.from.email,
    subject: message.subject,
    text: message.message,
    html: message.body,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const result = await sgMail.send(msg);

  return await sgMail
    .send(msg)
    .then((res) => {
      response.statusCode = res[0].statusCode;
      response.description = "";
      response.BodyResponse = res;
      return this.response;
    })
    .catch((error) => {
      response.statusCode = error.status||500;
      response.description = "";
      response.BodyResponse = error;
      return response;
    });
}
module.exports = { Send };
