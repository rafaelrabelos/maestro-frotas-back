const { mysql } = require("../connection");

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
      r.active_role, 
      r.role_name, 
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
  
  const [rows] = await db.query(`
  SELECT 
    u.nome, 
    u.email, 
    r.code, 
    DATEDIFF(r.valid_date, r.created_at)  as dif,
    r.created_at, 
    r.valid_date 
  FROM recovery r 
  JOIN users u ON u.id = r.user_id 
  WHERE  u.cpf = '${cpf}'`);

  return rows;
}

async function generateRecoverCodeByCpf(cpf){

  const db = await mysql();

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

module.exports = { GetAll, GetByCpf, GetWithRolesByCpf, GetRecoverCodeByCpf };
