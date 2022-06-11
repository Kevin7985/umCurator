const db = new (require('../../../DAL/DAL')) ();

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
  let fioParts = input.split(' ');
  let userFIO = {
    first_name: fioParts[1].charAt(0).toUpperCase() + fioParts[1].substr(1),
    last_name: fioParts[0].charAt(0).toUpperCase() + fioParts[0].substr(1),
    patronymic: fioParts[2].charAt(0).toUpperCase() + fioParts[2].substr(1)
  };

  await db.users.updateUserByTelegramId(telegram_id, {fio: userFIO});
}

module.exports = {
  fioValid,
  fioSave
};