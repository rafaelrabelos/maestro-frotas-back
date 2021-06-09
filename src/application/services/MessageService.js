const MessageRepository = require("../../infra/database/repository/MessageRepository");

async function CreateNewMessage({from, to, title, message}){
  
  const messageData = await MessageRepository.SaveNewMessage({from_id: from, to_id: to, title, message})

  if(messageData.erro) return { errorMessage: messageData.erro };

  if(messageData && messageData.affectedRows == 1){
    return { status: true, afected: messageData.affectedRows, info: messageData };
  }
  
  return { errorMessage: "Não foi possível enviar a mensagem" };

}

module.exports = { CreateNewMessage }