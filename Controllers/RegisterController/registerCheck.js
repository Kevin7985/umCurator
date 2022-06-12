const UserRegistry = new (require('../../lib/UserRegistry')) ();
const MainRouter = new (require('../../lib/MainRouter')) ();

const check = async (user) => {
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
    return 'subjectSelect';
  }

  if (!user.roles || user.roles.length === 0) {
    return 'rolesSelect';
  }

  return 'SUCCESS';
};

const init = async (msg, user) => {
  let result = await check(user);

  if (result === 'SUCCESS') {
    return true;
  }

  let userLocal = UserRegistry.getUser(user.telegram_id);

  userLocal.setState('register', 'stages', `${result}_restart`);
  await MainRouter.moveByUserState({message: msg});

  return false;
};

module.exports = init;