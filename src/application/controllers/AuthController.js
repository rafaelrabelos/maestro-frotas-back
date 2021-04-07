const jwt = require("../midleware/jwt");
const AuthService = require("../services/AuthService");

async function Auth(req, res) {
  const { cpf, senha } = req.body;
  const user = await AuthService.AutheticateUser(cpf, senha);

  if (!user) {
    return res.status(500).send({
      status: false,
      erros: [`Erro ao autenticar.`],
    });
  }

  if (!Array.isArray(user) && user.errorMessage) {
    return res.status(400).send({
      status: false,
      erros: user.errorMessage,
    });
  }

  res.status(200).send(await MountAuthResponse(user));
}

async function RecoverPassword(req, res) {
  const { cpf, code } = req.body;
  const recoverRes = await AuthService.RecoverUserPassWord(cpf, code);

  if (!recoverRes) {
    return res
      .status(500)
      .send({ status: false, erros: [`Erro ao executar a ação.`] });
  }

  if(recoverRes.errorMessage){
    return res
      .status(400)
      .send({ status: false, erros: [recoverRes.errorMessage] });
  }

  res.status(200).send({ ...recoverRes});
}

async function MountAuthResponse(user = {}) {
  const res = {
    status: true,
    data: {
      user: {
        nome: user.nome,
        cpf: user.cpf,
      },
      token: jwt.generateToken(
        {
          id: user.id,
          user: user,
          type: user.type,
        },
        user.is_sys == 1 ? 30 : 6400
      ),
    },
  };

  return res;
}

module.exports = { Auth, RecoverPassword };