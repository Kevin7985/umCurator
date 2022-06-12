const db = new (require('../../../DAL/DAL')) ();
const UserRegistry = new (require('../../../lib/UserRegistry')) ();

const botFactory = new (require('../../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const init = async (data) => {
  let msg = data.message;
  let userLocal = UserRegistry.getUser(msg.getUser('id'));

  if (data.payload[1] && data.payload[1] === 'restart') {
    await Bot.sendMessage(msg.getChat('id'), 'Похоже, в прошлый раз мы не закончили регистрацию!\n\nНапиши свои ФИО:');

    userLocal.setState('register', 'stages', 'fioInput');
  }
  else {
    let state = await fioSave(msg.getUser('id'), msg.getMessage('text'));
    if (!state) {
      await Bot.sendMessage(msg.getChat('id'), 'Введённые тобой данные не соответствуют формату ФИО! Должно быть 3 слова, разделённые ровно <b>одним пробелом</b>! Попробуй ещё раз:');
      return;
    }

    await Bot.sendMessage(msg.getChat('id'), '<b>ФИО успешно сохранены!</b>\n\nТеперь введи свою почту, которую ты указал(-а) при регистрации на сайте:');
    userLocal.setState('register', 'stages', 'emailInput');
  }
};

const fioValid = (input) => {
  let parts = [];

  try {
    parts = input.split(' ');
  } catch (e) {
    return false;
  }

  if (parts.length !== 3) {
    return false;
  }

  return true;
};

const fioSave = async (telegram_id, input) => {
  let valid = fioValid(input);
  if (!valid) {
    return false;
  }

  let fioParts = input.split(' ');
  let userFIO = {
    first_name: fioParts[1].charAt(0).toUpperCase() + fioParts[1].substr(1),
    last_name: fioParts[0].charAt(0).toUpperCase() + fioParts[0].substr(1),
    patronymic: fioParts[2].charAt(0).toUpperCase() + fioParts[2].substr(1)
  };

  await db.users.updateUserByTelegramId(telegram_id, {fio: userFIO});
  return true;
}

module.exports = {
  init
};