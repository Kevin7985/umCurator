const TelegramBot = require('node-telegram-bot-api');

class NodeTelegramBotApi {
  static instance = null;

  Keyboard = require('./dependences/keyboards/Keyboard');
  Emoji = new (require('./dependences/emoji/emoji')) ();

  constructor(token) {
    if (NodeTelegramBotApi.instance) {
      return NodeTelegramBotApi.instance;
    }

    NodeTelegramBotApi.instance = this;

    this.bot = new TelegramBot(token, {polling: true});
    this.MessageParser = require('./lib/MessageParser');
  }

  async sendMessage(chat_id, text, options = {parse_mode: 'HTML'}) {
    if (!options.parse_mode) {
      options.parse_mode = 'markdown';
    }

    return (await this.bot.sendMessage(chat_id, text, options));
  }

  async listen(callback) {
    this.bot.on('text', message => {
      let msg = this.MessageParser.parse('text', message);
      return callback(msg);
    });
  }
}

module.exports = NodeTelegramBotApi;