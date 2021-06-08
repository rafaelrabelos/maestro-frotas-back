const UserService = require("../services/UserService");
const password_check = require("password-validator");
const validaCpfCnpj = require("cpf-cnpj-validator");
const secure = require("../../util/libs/secure");

async function createUser(req, res) {
  var { cpf, nome, email, senha } = req.body;

  email = email.replace(/[^a-zA-Z0-9@-_.]/gi, "");
  cpf = cpf.replace(/[^0-9]/g, "");

  try {
    if (!validaCpfCnpj.cpf.isValid(cpf)) {
      return res.status(400).send({ status: false, erros: ["CPF inválido"] });
    }

    if (!nome || !email || !senha || !cpf) {
      return res.status(400).send({
        status: false,
        erros: [`Atributos obrigatorios: nome, email, senha e cpf.`],
      });
    }

    if (await UserService.CpfOrEmailExists(cpf, email)) {
      return res
        .status(400)
        .send({ status: false, erros: ["Dados já existem no sistema"] });
    }

    const user = await UserService.CreateNewUser({
      ...req.body,
      criadoPor: req.decodedJWT.id || undefined,
    });

    return res.status(200).send({ status: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

async function getUsers(req, res) {
  try {
    const meUser = await UserService.GetUserWithRolesById(req.decodedJWT.id);
    let users = await UserService.GetBasedOnRole(meUser.role_name);

    return res.status(200).send({ status: true, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

async function getSelfUser(req, res) {
  try {
    const users = await UserService.GetUserWithRolesById(req.decodedJWT.id);

    return res.status(200).send({ status: true, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

async function getUser(req, res) {
  try {
    var user = await UserService.GetUserWithRolesById(
      req.params.usuarioId || req.decodedJWT.id
    );

    return res.status(200).send({ status: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

// refactor
async function updateSelfUser(req, res) {
  const { nome, sobrenome, email } = req.body;

  try {
    if (!nome || !sobrenome || !email) {
      return res.status(400).send({
        status: false,
        erros: ["Ha campo(s) que devem ser informados!"],
      });
    }

    const usuarioId = req.params.usuarioId || req.decodedJWT.id;

    const user = await UserService.GetUserWithRolesById(usuarioId);

    if (!user) {
      return res
        .status(400)
        .send({ status: false, erros: ["Usuario nao localizado."] });
    }

    const userUpdated = await UserService.UpdateUser(usuarioId, {
      nome,
      sobrenome,
      email,
    });

    console.log(userUpdated);

    return res.status(200).send({ status: true, data: userUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

// refactor
async function deleteUser(req, res) {
  try {
    if (req.params.usuarioId.toString() === req.decodedJWT.id.toString()) {
      return res
        .status(400)
        .send({ status: false, erros: ["Usuario náo pode se auto deletar."] });
    }

    const usuarioId = req.params.usuarioId;

    const canDeleteResult = await userCanDelete(req.decodedJWT.id, usuarioId);

    if (canDeleteResult !== true) {
      return res.status(400).send({ status: false, erros: [canDeleteResult] });
    }

    // update to mysql
    const userDeleted = await UserService.RemoveUser(usuarioId);

    return res.status(200).send({ status: true, data: userDeleted });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

async function userCanDelete(userToActId, userToDeleteId) {

  const userToAct = await UserService.GetUserWithRolesById(userToActId);
  const userToDelete = await UserService.GetUserWithRolesById(userToDeleteId);

  if (!userToAct || !userToDelete) {
    return "Usuario(s) nao localizado.";
  }
  if (userToAct.is_adm) {
    const res = !(
      userToDelete.is_adm ||
      userToDelete.is_root ||
      userToDelete.is_sys
    );
    return res || "Administrador náo pode deletar o usuario.";
  } else if (userToAct.root) {
    const res = !userToDelete.is_root;
    return res || "root náo pode deletar o usuario root.";
  } else if (userToAct.is_sys) {
    const res = !(
      userToDelete.is_sys ||
      userToDelete.is_root ||
      userToDelete.is_adm
    );
    return res || "Sistema sem privilegios para remover.";
  } else {
    return true;
  }
}

// refactor
async function selectPermissions(req) {
  const permissions = {
    root:
      (await secure.checkUserRights(req, { root: true })) === true
        ? "+administrador +system_user +root"
        : false,
    admin:
      (await secure.checkUserRights(req, { admin: true })) === true
        ? "+administrador +system_user"
        : false,
    sys:
      (await secure.checkUserRights(req, { system: true })) === true
        ? "+system_user"
        : false,
  };

  if (permissions.root !== false) return permissions.root;
  else if (permissions.admin !== false) return permissions.admin;
  else if (permissions.sys !== false) return permissions.sys;
  else return "";
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  getSelfUser,
  updateSelfUser,
  deleteUser,
};
