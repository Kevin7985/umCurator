const TelegramBot = require('node-telegram-bot-api');

class NodeTelegramBotApi {
  static instance = null;

  constructor(token) {
    if (NodeTelegramBotApi.instance) {
      return NodeTelegramBotApi.instance;
    }

    NodeTelegramBotApi.instance = this;

    this.bot = new TelegramBot(token, {polling: true});
  }
}

module.exports = NodeTelegramBotApi;