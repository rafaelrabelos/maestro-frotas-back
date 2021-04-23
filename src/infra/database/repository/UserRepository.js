const { mysql } = require("../connection");
const bcrypt = require("bcrypt");

async function GetAll() {
  const db = await mysql();

  const [rows] = await db.query(`
  SELECT 
    u.id,
      u.nome, 
      u.sobrenome,
      u.cpf,
      u.email,
      u.data_nascimento,
      u.role AS role_id,
      u.criado_em,
      u.criado_por
    FROM users u
  `);
  return rows;
}

async function GetById(id) {
  const db = await mysql();

  const [rows] = await db.query(`
   SELECT 
      u.id,
      u.nome, 
      u.sobrenome,
      u.cpf,
      u.email, 
      u.data_nascimento,
      u.criado_em,
      u.criado_por
    FROM  users AS u
    WHERE  u.id= '${id}'`);

  return rows;
}

async function GetWithRolesById(id) {
  const db = await mysql();

  const [rows] = await db.query(`
   SELECT 
      u.id,
      u.nome, 
      u.sobrenome,
      u.cpf,
      u.email, 
      u.data_nascimento,
      u.criado_em,
      u.criado_por,
      IF(r.active_role, 1,0) AS active_role,
      IF(r.root_role, 1,0) AS is_root,
      IF(r.sys_role,  1,0) AS is_sys,
      IF(r.user_role, 1,0) AS is_user,
      IF(r.adm_role, 1,0) AS is_adm
    FROM  users AS u
    JOIN roles AS r
      ON u.role = r.id
    WHERE  u.id= '${id}'`);

  return rows;
}

async function GetByCpf(cpf = "") {
  const db = await mysql();

  const [rows] = await db.query(`
   SELECT 
      u.id,
      u.nome, 
      u.sobrenome,
      u.cpf,
      u.email, 
      u.data_nascimento,
      u.criado_em,
      u.criado_por
    FROM  users AS u
    WHERE  u.cpf = '${cpf}'`);

  return rows;
}

async function GetByCpfOrEmail(cpf = "", email = "") {
  const db = await mysql();

  const [rows] = await db.query(`
   SELECT 
      u.id,
      u.nome, 
      u.sobrenome,
      u.cpf,
      u.email, 
      u.data_nascimento,
      u.criado_em,
      u.criado_por
    FROM  users AS u
    WHERE  u.cpf = '${cpf}' OR u.email = '${email}'`);

  return rows;
}

async function GetWithRolesByCpf(cpf = "") {
  const db = await mysql();

  const [rows] = await db.query(`
   SELECT
      u.id,
      u.nome, 
      u.sobrenome, 
      u.email,
      u.cpf, 
      u.senha, 
      u.data_nascimento, 
      r.role_name, 
      IF(r.active_role, 1,0) AS active_role,
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

async function GetRecoverCodeByCpf(cpf = "", buildNew = true){
  const db = await mysql();

  if(buildNew){
    await ClearRecoverCodeByCpf(cpf);
    await generateRecoverCodeByCpf(cpf);
  }
  
  
  const [rows] = await db.execute(`
  SELECT 
    u.nome, 
    u.email, 
    r.code, 
    (r.valid_date > NOW())  as code_is_valid,
    r.created_at, 
    r.valid_date 
  FROM recovery r 
  JOIN users u ON u.id = r.user_id 
  WHERE  u.cpf = '${cpf}'`);

  return rows;
}

async function GetUserRoleId(){

  const db = await mysql();

  const [rows] = await db.execute(`
  SELECT id 
    FROM roles 
    WHERE user_role = 1 
    AND active_role = 1 
    AND adm_role = 0 
    AND adm_role = 0 
    AND sys_role = 0
    AND root_role = 0
    LIMIT 1;`)

    return rows[0].id;
}

async function InsertUser({cpf, nome, email, senha, criadoPor}){

  const db = await mysql();
  var roleId = await GetUserRoleId();

  const [rows] = await db.execute(`
  INSERT INTO users
  (
    nome, 
    sobrenome, 
    cpf, 
    senha, 
    role, 
    criado_por, 
    email)
  VALUES
  (
    '${nome}', 
    '', 
    '${cpf}', 
    '${senha}', 
    ${roleId}, 
    ${criadoPor}, 
    '${email}');
  `);

  return rows;
}

async function generateRecoverCodeByCpf(cpf){

  const db = await mysql();

  const existCpf = await UserCpfExists(cpf);

  if(!existCpf){
    return [];
  }

  const [rows] = await db.query(`
  INSERT INTO recovery 
  (user_id) 
  VALUES(
    (SELECT id
      FROM users 
      WHERE cpf = '${cpf}')
    )`);

  return rows;

}

async function ClearRecoverCodeByCpf(cpf){

  const db = await mysql();
  
  const [rows] = await db.query(`
  DELETE FROM 
    recovery
	WHERE user_id 
  IN(
    SELECT id 
    FROM users 
    WHERE cpf = '${cpf}')`);
    

  return rows;
}

async function UpdatePasswordByCpf(cpf, pass){

  pass = await bcrypt.hash(pass, 10);
  const clear = await ClearRecoverCodeByCpf(cpf);

  const db = await mysql();
  
  const [rows] = await db.query(`
  UPDATE users SET senha='${pass}' WHERE cpf='${cpf}'
  `);

  return rows;
}

async function UserCpfExists(cpf =""){

  const db = await mysql();

  const [rows] = await db.query(`
    SELECT IF(
    (SELECT COUNT(*) 
      FROM users 
      WHERE cpf = '${cpf}') = 1,
    TRUE, FALSE) AS exist;`);

    return rows.length === 1 ? rows[0].exist : false;
}

async function UserCpfOrEmailExists(cpf ="", email = ""){

  const db = await mysql();

  const [rows] = await db.query(`
    SELECT IF(
    (SELECT COUNT(*) 
      FROM users 
      WHERE cpf = '${cpf}' OR
       email = '${email}') = 1,
    TRUE, FALSE) AS exist;`);

    return rows.length === 1 ? rows[0].exist : false;
}

module.exports = { GetAll, 
  GetByCpf, 
  GetById, 
  GetByCpfOrEmail, 
  GetWithRolesByCpf,
  GetWithRolesById, 
  GetRecoverCodeByCpf, 
  UserCpfExists,
  UserCpfOrEmailExists,
  UpdatePasswordByCpf,
  InsertUser};
