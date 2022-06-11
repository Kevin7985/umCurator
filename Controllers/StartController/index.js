const Controller = require('../../lib/Controller');

const botFactory = new (require('../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const UserRegistry = new (require('../../lib/UserRegistry')) ();

class Index extends Controller {
  constructor() {
    super();
  }

  async initAction(data) {
    let msg = data.message;

    await Bot.sendMessage(msg.getChat('id'), 'Привет! Начинаем знакомство :)');

    let user = UserRegistry.getUser(msg.getUser('id'));
    user.setState('start', 'register');
  }

  async registerAction(data) {
    let msg = data.message;
  }
}

module.exports = Index;