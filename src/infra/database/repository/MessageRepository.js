const { mysql } = require("../connection");
const bcrypt = require("bcrypt");

async function SaveNewMessage({from_id, to_id, title, message}) {
  const db = await mysql();

  console.log(`
  INSERT INTO 
  messages
  (from_user, to_user, title, message)
  VALUES(${from_id}, ${to_id}, ${title}, ${message});
  `)

  if(!from_id || !to_id) return { erro: "Messagem sem destinatário ou remetente" }
  

  const [rows] = await db.query(`
  INSERT INTO 
  messages
  (from_user, to_user, title, message)
  VALUES(${from_id}, ${to_id}, '${title}', '${message}');
  `);

  return rows;
}

module.exports = { SaveNewMessage };