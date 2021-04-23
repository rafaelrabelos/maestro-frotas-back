const mysql = require('mysql2/promise');

async function mysqlConnection(){
  if(global.mysqlConnection && global.mysqlConnection.state !== 'disconnected')
      return global.mysqlConnection;
      try {
        const connection = await mysql.createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASS,
          database: process.env.MYSQL_DATABASE,
        });

        global.mysqlConnection = connection;
        return connection;
      } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error);
        console.log('\x1b[31m%s\x1b[33m%s\x1b[0m', `--> `, `Message: ${error.message}`);
        console.log('\x1b[31m%s\x1b[33m%s\x1b[0m', `--> `, `Code: ${error.code}`);
        console.log('\x1b[31m%s\x1b[33m%s\x1b[0m', `--> `, `Errno: ${error.errno}`);
        console.log('\x1b[31m%s\x1b[33m%s\x1b[0m', `--> `, `Sql State: ${error.sqlState}`);
        console.log(error);

        global.mysqlConnection = null;
        const dbErro = () => [{ erro: 'Erro na comunicação com DB(Banco de dados)' }];
        return {
          query: dbErro,
          execute: dbErro
        };
      }
}

module.exports = mysqlConnection;

