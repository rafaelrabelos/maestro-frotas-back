const PoliciesRepository = require('../../infra/database/repository/PoliciesRepository');
const UserRepository = require('../../infra/database/repository/UserRepository');

async function GetPoliciesByIP(ip){

  var policies = await PoliciesRepository.GetByIp(ip);

  return(policies);
}

async function SyncSuspeciousTrying(ip, cpf=null){

  var user = null;

  if(cpf){
    user = await UserRepository.GetByCpf(cpf);

    if(Array.isArray(user) && user.length == 1){
      user = user[0].id;
    }else{
      user = null;
    }
  }

  var policies = await PoliciesRepository.InsertOrUpdateSuspeciousTrying(ip, user);

  return(policies);
}


module.exports = { GetPoliciesByIP, SyncSuspeciousTrying };
