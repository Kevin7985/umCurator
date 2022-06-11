const BotMessage = require('./BotMessage');

const parse = (type, message) => {
  let msg = undefined;

  if (type === 'text') {
    let user = {
      id: message.from.id,
      username: (message.from.username || message.from.first_name)
    };

    let chat = {
      id: message.chat.id,
      type: message.chat.type
    };

    let msgObj = {
      id: message.message_id,
      date: message.date,
      text: message.text
    };

    msg = new BotMessage('text', user, chat, msgObj);
  }

  return msg;
};

module.exports = {
  parse
};