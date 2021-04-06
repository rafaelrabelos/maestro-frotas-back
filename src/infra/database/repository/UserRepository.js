const { mysql } = require("../connection");
const bcrypt = require("bcrypt");

async function GetAll() {
  const db = await mysql();

  const [rows] = await db.query(`
  SELECT * FROM users
  `);
  return rows;
}

async function GetByCpf(cpf = "") {
  const db = await mysql();

  const [rows] = await db.query(`
   SELECT *
    FROM  users AS u
    WHERE  u.cpf = '${cpf}'`);

  return rows;
}

async function GetWithRolesByCpf(cpf = "") {
  const db = await mysql();

  const [rows] = await db.query(`
   SELECT
      u.nome, 
      u.sobrenome, 
      u.senha, u.data_nascimento, 
      r.active_role , 
      r.role_name , 
      IF(r.root_role, 1,0) AS is_root,
      IF(r.sys_role,  1,0) AS is_sys,
      IF(r.user_role, 1,0) AS is_user,
      IF(r.adm_role, 1,0) AS is_adm
    FROM  users AS u
      JOIN roles AS r
      ON u.role = r.id
    WHERE  u.cpf = '${cpf}'`);

  return rows;
}

module.exports = { GetAll, GetByCpf, GetWithRolesByCpf };
