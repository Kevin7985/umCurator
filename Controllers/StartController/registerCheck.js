const registerCheck = async (user) => {
  if (!user.fio) {
    return 'fioInput';
  }

  if (!user.fio.first_name || user.fio.first_name.length === 0) {
    return 'fioInput';
  }

  if (!user.fio.last_name || user.fio.last_name.length === 0) {
    return 'fioInput';
  }

  if (!user.fio.patronymic || user.fio.patronymic.length === 0) {
    return 'fioInput';
  }

  if (!user.email || user.email.length === 0) {
    return 'emailInput';
  }

  if (!user.subject_code || user.subject_code.length === 0) {
    return 'sujectSelect';
  }
  return 'SUCCESS';
};

module.exports = registerCheck;