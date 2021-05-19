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
        console.log(error.message);
        global.mysqlConnection = null;
        return null;
      }
}

module.exports = mysqlConnection;

