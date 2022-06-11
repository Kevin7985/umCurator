const BotMessage = require('./BotMessage');

const parse = (type, message) => {
  let messageData = message;
  if (type === 'callback') {
    messageData = message.message;
  }

  let user = {
    id: messageData.from.id,
    username: (messageData.from.username || messageDatas.from.first_name)
  };

  let chat = {
    id: messageData.chat.id,
    type: messageData.chat.type
  };

  let msgObj = {
    id: messageData.message_id,
    date: messageData.date,
    text: messageData.text
  };

  let callback = {};

  let messageType = undefined;

  if (type === 'text') {
    messageType = 'text';
  }
  else if (type === 'callback') {
    messageType = 'callback';
    callback = {
      id: message.id,
      data: message.data
    };
  }

  return new BotMessage(messageType, user, chat, msgObj, callback);
};

module.exports = {
  parse
};