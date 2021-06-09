const UserService = require("../services/UserService");
const MessageService = require("../services/MessageService");

async function SendContactPageMessage(req, res) {

  try {
    const from = req.params.usuarioId || req.decodedJWT.id;
    const { name, email, subject, message } = req.body;

    if(!name || !email || !subject || !message) return res
    .status(400)
    .send({ status: false, erros: ['Dados não informados'] });

    const to = await UserService.GetSysAdminUser();

    if(!to) return res
    .status(400)
    .send({ status: false, erros: ['Destinatário não configurado'] });

    if (to.errorMessage) {
      return res
        .status(400)
        .send({ status: false, erros: [to.errorMessage] });
    }

    const bodymsg = `
    Nome: ${name}
    E-mail: ${email},
    Assunto: ${subject}
    Message:${message}`;

    const createMessageRes = await MessageService.CreateNewMessage({ from, to: to.id, title: subject, message: bodymsg });

    if (!createMessageRes) {
      return res
        .status(500)
        .send({ status: false, erros: [`Erro ao executar a ação.`] });
    }
  
    if (createMessageRes.errorMessage) {
      return res
        .status(400)
        .send({ status: false, erros: [createMessageRes.errorMessage] });
    }

    return res.status(200).send({ status: true, data: createMessageRes });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }

}

module.exports = { SendContactPageMessage };
