const Controller = require('../../lib/Controller');

const botFactory = new (require('../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const UserRegistry = new (require('../../lib/UserRegistry')) ();
const MainRouter = new (require('../../lib/MainRouter')) ();

const db = new (require('../../DAL/DAL')) ();

const fioInputStage = require('./stages/fioInput');
const emailInputStage = require('./stages/emailInput');

class Index extends Controller {
  constructor() {
    super();
  }

  async initAction(data) {
    let msg = data.message;

    await db.users.addUserIfNotExists(msg.getUser('id'));

    await Bot.sendMessage(msg.getChat('id'), 'Привет! Давай знакомиться! Напиши свои ФИО:');

    let userLocal = UserRegistry.getUser(msg.getUser('id'));
    userLocal.setState('register', 'stages', 'fioInput');
  }

  async stagesAction(data) {
    let msg = data.message;

    if (data.payload[0] === 'fioInput') {
      let state = fioInputStage.fioValid(msg.getMessage('text'));
      if (!state) {
        await Bot.sendMessage(msg.getChat('id'), 'Введённые тобой данные не соответствуют формату ФИО! Должно быть 3 слова, разделённые ровно <b>одним пробелом</b>! Попробуй ещё раз:');
        return;
      }

      await fioInputStage.fioSave(msg.getUser('id'), msg.getMessage('text'));

      await Bot.sendMessage(msg.getChat('id'), '<b>ФИО успешно сохранены!</b>\n\nТеперь введи свою почту, которую ты указал(-а) при регистрации на сайте:');

      let userLocal = UserRegistry.getUser(msg.getUser('id'));
      userLocal.setState('register', 'stages', 'emailInput');
    }
    else if (data.payload[0] === 'emailInput') {
      let state = emailInputStage.emailValid(msg.getMessage('text'));
      if (!state) {
        await Bot.sendMessage(msg.getChat('id'), 'Введённые тобой данные не соответствуют формату E-mail! Попробуй ещё раз:');
        return;
      }

      await emailInputStage.emailSave(msg.getUser('id'), msg.getMessage('text'));

      await Bot.sendMessage(msg.getChat('id'), '<b>Почта успешно сохранена!</b>\n\nПока что на этом всё, но регистрация на этом не завершена!');

      let userLocal = UserRegistry.getUser(msg.getUser('id'));
      userLocal.setState('register', 'stages', 'subjectSelect');
    }
    else if (data.payload[0] === 'subjectSelect') {
      console.log(msg);
    }
  }
}

module.exports = Index;