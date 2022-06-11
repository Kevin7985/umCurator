const Controller = require('../../lib/Controller');

const botFactory = new (require('../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const UserRegistry = new (require('../../lib/UserRegistry')) ();
const MainRouter = new (require('../../lib/MainRouter')) ();

const db = new (require('../../DAL/DAL')) ();
const registerCheck = require('./registerCheck');
const subjectSelectStage_register = require('../RegisterController/stages/subjectsInput');

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
      let checkReg = await registerCheck(userDB);
      if (checkReg !== 'SUCCESS') {
        let message = 'Похоже, в прошлый раз мы не закончили регистрацию!\n\n';
        if (checkReg === 'fioInput') {
          message += 'Напиши свои ФИО:';
        }
        else if (checkReg === 'emailInput') {
          message += 'Напиши свою почту, которую ты указал(-а) при регистрации на сайте:';
        }
        else if (checkReg === 'sujectSelect') {
          message += 'Выбери предмет, на котором работаешь:';
          userLocal.setState('register', 'stages', checkReg);
          await Bot.sendMessage(msg.getChat('id'), message, await subjectSelectStage_register.keyboard());
          return;
        }

        userLocal.setState('register', 'stages', checkReg);
        await Bot.sendMessage(msg.getChat('id'), message);
      }
      else {
        await Bot.sendMessage(msg.getChat('id'), 'Профиль скоро будет!');
      }
    }
  }
}

module.exports = Index;