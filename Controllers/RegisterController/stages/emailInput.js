const db = new (require('../../../DAL/DAL')) ();
const UserRegistry = new (require('../../../lib/UserRegistry')) ();

const botFactory = new (require('../../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const subjectsInputStage = require('./subjectsInput');

const init = async (data) => {
  let msg = data.message;
  let userLocal = UserRegistry.getUser(msg.getUser('id'));

  if (data.payload[1] && data.payload[1] === 'restart') {
    await Bot.sendMessage(msg.getChat('id'), 'Похоже, в прошлый раз мы не закончили регистрацию!\n\nНапиши свою почту, которую ты указал(-а) при регистрации на сайте:');

    userLocal.setState('register', 'stages', 'emailInput');
  }
  else {
    let state = await emailSave(msg.getUser('id'), msg.getMessage('text'));
    if (!state) {
      await Bot.sendMessage(msg.getChat('id'), 'Введённые тобой данные не соответствуют формату E-mail! Попробуй ещё раз:');
      return;
    }

    let keyboard = await subjectsInputStage.keyboard();
    await Bot.sendMessage(msg.getChat('id'), '<b>Почта успешно сохранена!</b>\n\nВыбери предмет, на котором работаешь:', keyboard);
    userLocal.setState('register', 'stages', 'subjectSelect');
  }
};

const emailValid = (input) => {
  let parts = [];

  try {
    parts = input.split('@');
  } catch (e) {
    return false;
  }

  if (parts.length !== 2) {
    return false;
  }

  let domainParts = [];

  try {
    domainParts = parts[1].split('.');
  } catch (e) {
    return false;
  }

  if (domainParts.length < 2) {
    return false;
  }

  return true;
};

const emailSave = async (telegram_id, input) => {
  let valid = emailValid(input);
  if (!valid) {
    return false;
  }

  await db.users.updateUserByTelegramId(telegram_id, {email: input});

  return true;
};

module.exports = {
  init
};