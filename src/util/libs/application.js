
function getEnviroment(env = process.env.ENVIROMENT) {
  
  var allowedEnvs = ['local','hml','prod'];
  
  var isValidEnv = allowedEnvs.filter( (val) => val == env ).length > 0;
  
  if (env && env !== '' && env !== null && env !== undefined && isValidEnv) {
    return env;
  }

  return getEnviroment('local');
}

module.exports = { getEnviroment };
