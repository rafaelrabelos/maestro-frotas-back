const {mysql} = require("../connection");
const bcrypt = require("bcrypt");


async function ObtemUsuarios(){

 const db = await mysql();

  const [rows] = await db.query('SELECT * FROM `users`');
  return rows;
}

module.exports = {ObtemUsuarios}