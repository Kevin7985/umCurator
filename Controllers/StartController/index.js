const Controller = require('../../lib/Controller');

const botFactory = new (require('../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const UserRegistry = new (require('../../lib/UserRegistry')) ();
const MainRouter = new (require('../../lib/MainRouter')) ();

const db = new (require('../../DAL/DAL')) ();
const registerCheck = require('../RegisterController/registerCheck');

class Index extends Controller {
  constructor() {
    super();
  }

  async initAction(data) {
    let msg = data.message;

    let userDB = await db.users.findUserByTelegramId(msg.getUser('id'));
    let userLocal = UserRegistry.getUser(msg.getUser('id'));

    if (!userDB) {
      userLocal.setState('register', 'init');
      await MainRouter.moveByUserState(data);
    }
    else {
      let checkReg = await registerCheck(msg, userDB);
      if (!checkReg) {
        return;
      }

      await Bot.sendMessage(msg.getChat('id'), 'Профиль скоро будет!');
    }
  }
}

module.exports = Index;