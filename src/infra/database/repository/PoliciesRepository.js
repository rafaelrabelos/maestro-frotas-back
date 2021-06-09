const { mysql } = require("../connection");
const timeToBlock = 15;

async function GetByIp(ip) {
  const db = await mysql();

  const [rows] = await db.query(`
  SELECT 
      p.id,
      p.user_id, 
      p.black_listed,
      (p.date_to_keep_blocked > NOW()) as is_blocked,
      p.date_to_keep_blocked,
      p.user_ip,
      p.created_at,
      p.counter,
      CONCAT(p.description,' ', ${timeToBlock}-TIMESTAMPDIFF(MINUTE,p.created_at, NOW()), ' minuto(s) restante(s)') as description
    FROM users_policies p
    WHERE p.user_ip = '${ip}'
  `);
  return rows;
}

async function RemoveByIp(ip) {
  const db = await mysql();

  const [rows] = await db.query(`
  DELETE FROM users_policies
  WHERE
    black_listed = 0 AND
    user_ip='${ip}'
  `);
  return rows;
}

async function ClearExpireds() {
  const db = await mysql();

  const [rows] = await db.query(`
  DELETE FROM users_policies
  WHERE
    black_listed = 0 AND
    (date_to_keep_blocked > NOW()) = 0 AND
    TIMESTAMPDIFF(MINUTE, created_at, NOW()) > ${timeToBlock}
  `);
  return rows;
}

async function GetByUserIdAndIp(userId, ip){
  const db = await mysql();

  const [rows] = await db.query(`
  SELECT 
      p.id,
      p.user_id, 
      p.black_listed,
      (p.date_to_keep_blocked > NOW()) as is_blocked,
      p.date_to_keep_blocked,
      p.user_ip,
      p.created_at,
      p.counter,
      p.description 
    FROM users_policies p
    WHERE
    user_id=${userId} AND user_ip='${ip}'
  `);
  return rows;
}

async function GetActiveSuspeciousTrying(ip, userId=null) {
  const db = await mysql();

  const [rows] = await db.query(`
  SELECT
    p.id, 
    p.user_id, 
    p.black_listed, 
    p.date_to_keep_blocked, 
    p.user_ip, 
    p.created_at, 
    p.counter, 
    CONCAT(p.description,' ', ${timeToBlock}-TIMESTAMPDIFF(MINUTE,p.created_at, NOW()), ' minuto(s) restante(s)') as description
  FROM users_policies p
  WHERE 
    TIMESTAMPDIFF(MINUTE,p.created_at, NOW()) < ${timeToBlock}
    AND p.user_ip = '${ip}' AND ${userId ? "user_id="+userId :'ISNULL(user_id)'}
  `);
  return rows;
}

async function UpdateSuspeciousTrying(ip, userId=null) {
  const db = await mysql();

  const [rows] = await db.query(`
  UPDATE users_policies AS up SET
    up.counter = up.counter +1,
    up.date_to_keep_blocked = IF(
      up.counter > ${timeToBlock}, 
      DATE_ADD(NOW(), 
      INTERVAL ${timeToBlock} MINUTE), NOW()
    ),
    description = IF(
      up.counter > ${timeToBlock}, 
      'IP @${ip} em bloqueio de ${timeToBlock} minutos.',
      CONCAT('Tentativa de acesso suspeita para @${ip}, tentativa ', up.counter,' de ${timeToBlock}')
    ),
    up.created_at = NOW()
    where
    ${userId? 'user_id='+userId : 'ISNULL(user_id)'} AND
    up.user_ip = '${ip}' AND
    TIMESTAMPDIFF(MINUTE, up.created_at, NOW()) < ${timeToBlock}
  `);
  
  return rows;
}

async function InsertSuspeciousTrying(ip, userId=null) {
  const db = await mysql();
  
  await ClearExpireds();

  const [rows] = await db.query(`
  INSERT INTO users_policies
  (${userId? 'user_id,':''} black_listed, date_to_keep_blocked, user_ip, created_at, counter, description)
  VALUES(${userId? userId+',':''} 0, NOW(), '${ip}', NOW(), 1, 'Tentativa de acesso suspeita para ${ip}@${userId || '*'}');
  `);
  return rows;
}

async function InsertOrUpdateSuspeciousTrying(ip, userId=null) {

  const existActive = await GetActiveSuspeciousTrying(ip, userId);

  if(Array.isArray(existActive) && existActive.length == 1){
    return UpdateSuspeciousTrying(ip, userId);
  }else if(Array.isArray(existActive) && existActive.length == 0){
    return InsertSuspeciousTrying(ip, userId);
  }else if(Array.isArray(existActive) && existActive.length > 1){
    await RemoveByIp(ip);
    return InsertOrUpdateSuspeciousTrying(ip, userId=null);
  }else{
    return [];
  }
}

module.exports = { 
  GetByUserIdAndIp,
  GetByIp, 
  GetActiveSuspeciousTrying, 
  ClearExpireds, 
  InsertOrUpdateSuspeciousTrying, 
  RemoveByIp };