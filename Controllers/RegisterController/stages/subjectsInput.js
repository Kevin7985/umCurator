const botFactory = new (require('../../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const db = new (require('../../../DAL/DAL')) ();
const UserRegistry = new (require('../../../lib/UserRegistry')) ();

const rolesSelect = require('./rolesInput');

const subjects = {
  'rus': `Русский язык ${Bot.Emoji.get('ru')}`,
  'math': `Математика ${Bot.Emoji.get('1234')}`,
  'social': `Обществознание ${Bot.Emoji.get('man-woman-boy')}`,
  'hist': `История ${Bot.Emoji.get('crossed_swords')}`,
  'lit': `Литература ${Bot.Emoji.get('books')}`,
  'eng': `Английский язык ${Bot.Emoji.get('flag-gb')}`,
  'chem': `Химия ${Bot.Emoji.get('test_tube')}`,
  'bio': `Биология ${Bot.Emoji.get('microscope')}`,
  'phys': `Физика ${Bot.Emoji.get('atom_symbol')}`,
  'inf': `Информатика ${Bot.Emoji.get('computer')}`,
  'geo': `География ${Bot.Emoji.get('earth_africa')}`,
  'nem': `Немецкий язык ${Bot.Emoji.get('de')}`

};

const init = async (data, roles) => {
  let msg = data.message;
  let userLocal = UserRegistry.getUser(msg.getUser('id'));

  if (data.payload[1] && data.payload[1] === 'restart') {
    await Bot.sendMessage(msg.getChat('id'), 'Похоже, в прошлый раз мы не закончили регистрацию!\n\nВыбери предмет, на котором работаешь:', await keyboard());

    userLocal.setState('register', 'stages', 'subjectSelect');
  }
  else {
    if (msg.getType() !== 'callback') {
      await Bot.sendMessage(msg.getChat('id'), 'При выборе предмета поддерживаются только нажатия на кнопку!');
      return;
    }

    if (!data.payload[1]) {
      await Bot.sendMessage(msg.getChat('id'), 'Произошла неизвестная ошибка! Повторите выбор ещё раз');
      return;
    }

    await subjectSave(msg.getUser('id'), data.payload[1]);

    await Bot.editMessage(msg.getChat('id'), msg.getMessage('id'), `Выбран предмет: <b>${subjects[data.payload[1]]}</b>`);

    let keyboard = await rolesSelect.mainKeyboard(roles);
    await Bot.sendMessage(msg.getChat('id'), '<b>Предмет успешно сохранён!</b>\n\nТеперь выбери должности, на которых ты работаешь:', keyboard);
    userLocal.setState('register', 'stages', 'rolesSelect');
  }
};

const keyboard = async () => {
  let Keyboard = new Bot.Keyboard('inline_keyboard');
  let Button = await Keyboard.Button();

  let rus = new Button('callback_data', `Русский язык ${Bot.Emoji.get('ru')}`, {callback_data: 'register_stages_subjectSelect_rus'});
  let math = new Button('callback_data', `Математика ${Bot.Emoji.get('1234')}`, {callback_data: 'register_stages_subjectSelect_math'});
  let social = new Button('callback_data', `Обществознание ${Bot.Emoji.get('man-woman-boy')}`, {callback_data: 'register_stages_subjectSelect_social'});
  let hist = new Button('callback_data', `История ${Bot.Emoji.get('crossed_swords')}`, {callback_data: 'register_stages_subjectSelect_hist'});
  let lit = new Button('callback_data', `Литература ${Bot.Emoji.get('books')}`, {callback_data: 'register_stages_subjectSelect_lit'});
  let eng = new Button('callback_data', `Английский язык ${Bot.Emoji.get('flag-gb')}`, {callback_data: 'register_stages_subjectSelect_eng'});
  let chem = new Button('callback_data', `Химия ${Bot.Emoji.get('test_tube')}`, {callback_data: 'register_stages_subjectSelect_chem'});
  let bio = new Button('callback_data', `Биология ${Bot.Emoji.get('microscope')}`, {callback_data: 'register_stages_subjectSelect_bio'});
  let phys = new Button('callback_data', `Физика ${Bot.Emoji.get('atom_symbol')}`, {callback_data: 'register_stages_subjectSelect_phys'});
  let inf = new Button('callback_data', `Информатика ${Bot.Emoji.get('computer')}`, {callback_data: 'register_stages_subjectSelect_inf'});
  let geo = new Button('callback_data', `География ${Bot.Emoji.get('earth_africa')}`, {callback_data: 'register_stages_subjectSelect_geo'});
  let nem = new Button('callback_data', `Немецкий язык ${Bot.Emoji.get('de')}`, {callback_data: 'register_stages_subjectSelect_nem'});

  return (await Keyboard.build([[rus, math], [social, hist], [lit, eng], [chem, bio], [phys, inf], [geo, nem]]));
};

const subjectSave = async (telegram_id, input) => {
  let res = await db.users.updateUserByTelegramId(telegram_id, {subject_code: input});
}

module.exports = {
  init
};