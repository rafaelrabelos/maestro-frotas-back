const dotenv = require("dotenv");
const application = require("./util/libs/application");
const enviroment = application.getEnviroment();

dotenv.config({ path: `./src/util/enviroments/${enviroment}.env` });
console.log(`- Using ${enviroment} enviroment`);

const api = require("./application/index");

api.executaAplicacao(process.env.PORT || process.env.API_PORT || 3000);
