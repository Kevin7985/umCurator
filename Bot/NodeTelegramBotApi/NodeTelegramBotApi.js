const TelegramBot = require('node-telegram-bot-api');

class NodeTelegramBotApi {
  static instance = null;

  constructor(token) {
    if (NodeTelegramBotApi.instance) {
      return NodeTelegramBotApi.instance;
    }

    NodeTelegramBotApi.instance = this;

    this.bot = new TelegramBot(token, {polling: true});
    this.MessageParser = require('./lib/MessageParser');
  }

  async listen(callback) {
    this.bot.on('text', message => {
      let msg = this.MessageParser.parse('text', message);
      return callback(msg);
    });
  }
}

module.exports = NodeTelegramBotApi;