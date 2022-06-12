const botFactory = new (require('../../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const db = new (require('../../../DAL/DAL')) ();
const UserRegistry = new (require('../../../lib/UserRegistry')) ();

const roleTitles = {
  'nast': 'Наставник кураторов',
  'stMch': 'МЧ Стандарт',
  'grandMch': 'Старший МЧ',
  'stCur': 'Куратор Стандарт',
  'proCur': 'ПРО-куратор'
};

const init = async(data, roles) => {
  let msg = data.message;
  let userLocal = UserRegistry.getUser(msg.getUser('id'));

  if (data.payload[1] && data.payload[1] === 'restart') {
    await Bot.sendMessage(msg.getChat('id'), 'Похоже, в прошлый раз мы не закончили регистрацию!\n\nВыбери должности, на которых ты работаешь:', await mainKeyboard(roles));

    userLocal.setState('register', 'stages', 'rolesSelect');
  }
  else {
    if (msg.getType() !== 'callback') {
      await Bot.sendMessage(msg.getChat('id'), 'На данном этапе управление производится только с помощью кнопок!');
      return;
    }

    if (!data.payload[1]) {
      await Bot.sendMessage(msg.getChat('id'), 'Произошла неизвестная ошибка! Повторите выбор ещё раз');
      return;
    }

    if (data.payload[1] === 'submit') {
      await rolesSave(msg.getUser('id'), roles);

      let selected_str = undefined;
      if (roles.length > 0) {
        selected_str = '\n\n<b>Выбрано</b>:';
        roles.forEach(item => {
          selected_str += `\n\t${roleTitles[item]}`;
        });
      }

      await Bot.editMessage(msg.getChat('id'), msg.getMessage('id'), selected_str);
      await Bot.sendMessage(msg.getChat('id'), '<b>Регистрация успешно завершена!</b>\n\nСписок выбранных должностей отправлен на проверку руководителю предмета. После того, как он одобрит, у тебя появятся функции соответствующих должностей');
      userLocal.setState(undefined, undefined);
      return;
    }

    let keyboard = await selectRole(roles, data.payload[1]);

    let selected_str = undefined;
    if (roles.length > 0) {
      selected_str = '\n\n<b>Выбрано</b>:';
      roles.forEach(item => {
        selected_str += `\n\t${roleTitles[item]}`;
      });
    }

    try {
      await Bot.editMessage(msg.getChat('id'), msg.getMessage('id'), `<b>Предмет успешно сохранён!</b>\n\nТеперь выбери должности, на которых ты работаешь: ${selected_str ? selected_str : ''}`, keyboard);
    } catch (e) {}
  }
};

const mainKeyboard = async (selected_roles = []) => {
  let Keyboard = new Bot.Keyboard('inline_keyboard');
  let Button = await Keyboard.Button();

  let nast = new Button('callback_data', `Наставник кураторов ${selected_roles.includes('nast') ? Bot.Emoji.get('white_check_mark') : ''}`, {callback_data: 'register_stages_rolesSelect_nast'});
  let mch = new Button('callback_data', `Менеджер чата`, {callback_data: 'register_stages_rolesSelect_mch'});
  let cur = new Button('callback_data', `Куратор`, {callback_data: 'register_stages_rolesSelect_cur'});
  let submit = new Button('callback_data', 'Сохранить', {callback_data: 'register_stages_rolesSelect_submit'});

  return (await Keyboard.build([[nast], [mch, cur], [submit]]));
};

const subKeyboard = async (type, selected_roles = []) => {
  let Keyboard = new Bot.Keyboard('inline_keyboard');
  let Button = await Keyboard.Button();
  let buttons = [];

  let back = new Button('callback_data', `<- Назад`, {callback_data: 'register_stages_rolesSelect_main'});
  let submit = new Button('callback_data', 'Сохранить', {callback_data: 'register_stages_rolesSelect_submit'});

  if (type === 'mch') {
    let grandMch = new Button('callback_data', `Старший МЧ ${selected_roles.includes('grandMch') ? Bot.Emoji.get('white_check_mark') : ''}`, {callback_data: 'register_stages_rolesSelect_grandMch'});
    let stMch = new Button('callback_data', `МЧ Стандарт ${selected_roles.includes('stMch') ? Bot.Emoji.get('white_check_mark') : ''}`, {callback_data: 'register_stages_rolesSelect_stMch'});
    buttons = [[grandMch, stMch], [back], [submit]];
  }
  else if (type === 'cur') {
    let proCur = new Button('callback_data', `ПРО-куратор ${selected_roles.includes('proCur') ? Bot.Emoji.get('white_check_mark') : ''}`, {callback_data: 'register_stages_rolesSelect_proCur'});
    let stCur = new Button('callback_data', `Куратор Стандарт ${selected_roles.includes('stCur') ? Bot.Emoji.get('white_check_mark'): ''}`, {callback_data: 'register_stages_rolesSelect_stCur'});
    buttons = [[proCur, stCur], [back], [submit]];
  }

  return (await Keyboard.build(buttons));
};

const selectRole = async (roles, selected) => {
  let keyboard = undefined;

  if (selected === 'nast') {
    roles.includes(selected) ? roles.splice(roles.indexOf(selected), 1) : roles.push(selected);

    keyboard = await mainKeyboard(roles);
  }
  else if (selected === 'mch' || selected === 'cur') {
    keyboard = await subKeyboard(selected, roles);
  }
  else if (selected === 'main') {
    keyboard = await mainKeyboard(roles);
  }
  else if (selected === 'stMch' || selected === 'grandMch') {
    if (roles.includes(selected)) {
      roles.splice(roles.indexOf(selected), 1);
    }
    else {
      roles.includes('stMch') ? roles.splice(roles.indexOf('stMch'), 1) : undefined;
      roles.includes('grandMch') ? roles.splice(roles.indexOf('grandMch'), 1) : undefined;

      roles.push(selected);
    }

    keyboard = await subKeyboard('mch', roles);
  }
  else if (selected === 'stCur' || selected === 'proCur') {
    if (roles.includes(selected)) {
      roles.splice(roles.indexOf(selected), 1);
    }
    else {
      roles.includes('stCur') ? roles.splice(roles.indexOf('stCur'), 1) : undefined;
      roles.includes('proCur') ? roles.splice(roles.indexOf('proCur'), 1) : undefined;

      roles.push(selected);
    }

    keyboard = await subKeyboard('cur', roles);
  }

  return keyboard;
};

const rolesSave = async (telegram_id, input) => {
  let res = await db.users.updateUserByTelegramId(telegram_id, {roles: input});
}

module.exports = {
  init
};