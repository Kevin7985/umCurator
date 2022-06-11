const botFactory = new (require('../../../Bot/BotFactory')) (process.env.BOT_LIB);
const Bot = botFactory.init(process.env.TELEGRAM_TOKEN);

const db = new (require('../../../DAL/DAL')) ();

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
  keyboard,
  subjectSave
};