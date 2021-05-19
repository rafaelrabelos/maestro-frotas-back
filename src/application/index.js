const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const os = require("os");
const databaseMidd = require("../application/midleware/databaseChecker");
const clearSlashMidd = require("../application/midleware/clearPath");

function executaAplicacao(port) {
  const hostname = os.hostname();
  const prefixApi = "/api";
  const versionApi = "/v1";
  const path = prefixApi + versionApi;

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(clearSlashMidd)
  app.use(databaseMidd) 
  app.use(path, routes);
  // TODO implement https://blog.rocketseat.com.br/upload-de-imagens-no-s3-da-aws-com-node-js/

  app.listen(port, () => {
    console.log(`server started at ${hostname}:${port}`);
  });
}

module.exports = { executaAplicacao };
