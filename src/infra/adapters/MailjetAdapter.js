const mailjet = require("node-mailjet").connect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

async function Send(message) {
  const msg = {
    From: {
      Email: message.from.email,
      Name: message.from.nome,
    },
    To: [
      {
        Email: message.to.email,
        Name: message.to.name,
      },
    ],
    Subject: message.subject,
    TextPart: message.message,
    HTMLPart: message.body,
    CustomID: "AppGettingStartedTest",
  };

  try {
    const request = await mailjet
      .post("send", { version: "v3.1" })
      .request({ Messages: [msg] });
    const { response } = request;

    return {
      status: response.statusCode === 200,
      statusCode: response.statusCode,
    };
  } catch (err) {
    console.log(err.statusCode);
    console.log(err.message);

    return {
      status: err.statusCode === 200,
      statusCode: err.statusCode,
      ErrorMessage: err.ErrorMessage,
    };
  }
}

module.exports = { Send };
