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
      erros: [user.errorMessage],
    });
  }

  res.status(200).send(await MountAuthResponse(user));
}

async function SendRecoveryInfo(req, res) {
  const { cpf } = req.body;

  const recoverRes = await AuthService.SendRecoveryInfo(cpf.replace(/[^0-9]/g, ''));

  if (!recoverRes) {
    return res
      .status(500)
      .send({ status: false, erros: [`Erro ao executar a ação.`] });
  }

  if (recoverRes.errorMessage) {
    return res
      .status(400)
      .send({ status: false, erros: [recoverRes.errorMessage] });
  }

  res.status(200).send({ ...recoverRes });
}

async function ValidateRecoveryCode(req, res) {
  const { cpf, code } = req.body;
  
  const recoverRes = await AuthService.ValidateRecoveryCode(cpf.replace(/[^0-9]/g, ''), code);
  console.log(recoverRes)

  if (!recoverRes) {
    return res
      .status(500)
      .send({ status: false, erros: [`Erro ao executar a ação.`] });
  }

  if (recoverRes.errorMessage) {
    return res
      .status(400)
      .send({ status: false, erros: [recoverRes.errorMessage] });
  }

  res.status(200).send({ ...recoverRes });
}

async function SetNewPassword(req, res) {
  const { cpf, code, pass } = req.body;
  const recoverRes = await AuthService.SetNewPassword(cpf.replace(/[^0-9]/g, ''), code, pass);

  if (!recoverRes) {
    return res
      .status(500)
      .send({ status: false, erros: [`Erro ao executar a ação.`] });
  }

  if (recoverRes.errorMessage) {
    return res
      .status(400)
      .send({ status: false, erros: [recoverRes.errorMessage] });
  }

  res.status(200).send({ ...recoverRes });
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
          description: "JWT Token",
          id: user.id,
          type: user.type,
          user: user,
        },
        user.is_sys == 1 ? 30 : 6400
      ),
    },
  };

  return res;
}

module.exports = { Auth, SendRecoveryInfo, ValidateRecoveryCode, SetNewPassword };
