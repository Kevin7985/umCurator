const Controller = require('../../lib/Controller');

const botFactory = new (require('../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const UserRegistry = new (require('../../lib/UserRegistry')) ();
const MainRouter = new (require('../../lib/MainRouter')) ();

const db = new (require('../../DAL/DAL')) ();

const fioInputStage = require('./stages/fioInput');
const emailInputStage = require('./stages/emailInput');
const subjectsInputStage = require('./stages/subjectsInput');
const rolesInputStage = require('./stages/rolesInput');

class Index extends Controller {
  constructor() {
    super();

    this.rolesSelect = {};
  }

  async initAction(data) {
    let msg = data.message;

    await db.users.addUserIfNotExists(msg.getUser('id'));

    await Bot.sendMessage(msg.getChat('id'), 'Привет! Давай знакомиться! Напиши свои ФИО:');

    let userLocal = UserRegistry.getUser(msg.getUser('id'));
    userLocal.setState('register', 'stages', 'fioInput');
  }

  async stagesAction(data) {
    if (data.payload[0] === 'fioInput') {
      await fioInputStage.init(data);
    }
    else if (data.payload[0] === 'emailInput') {
      await emailInputStage.init(data);
    }
    else if (data.payload[0] === 'subjectSelect') {
      if (!this.rolesSelect[data.message.getUser('id')]) {
        this.rolesSelect[data.message.getUser('id')] = [];
      }

      await subjectsInputStage.init(data, this.rolesSelect[data.message.getUser('id')]);
    }
    else if (data.payload[0] === 'rolesSelect') {
      if (!this.rolesSelect[data.message.getUser('id')]) {
        this.rolesSelect[data.message.getUser('id')] = [];
      }

      await rolesInputStage.init(data, this.rolesSelect[data.message.getUser('id')]);
    }
  }
}

module.exports = Index;