const { mysql } = require("../../infra/database/connection");

async function databaseChecker(req, res, next) {
  try {
    const db = await mysql();

    const [rows] = await db.query("SELECT 1 AS number");
    if (rows[0].number === 1){
      return next();
    }
  } catch (error) {
    console.log(error.message);
  }

  return res.status(500).send({
    status: false,
    erros: [`Erro na comunicação com o banco de dados`],
  });
}

module.exports = databaseChecker;
