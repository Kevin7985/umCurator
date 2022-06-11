const db = new (require('../../../DAL/DAL')) ();

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
  await db.users.updateUserByTelegramId(telegram_id, {email: input});
};

module.exports = {
  emailValid,
  emailSave
};