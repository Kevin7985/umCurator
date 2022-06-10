const User = require('./User');

class UserRegistry {
  static instance = null;

  #users = new Map();

  constructor() {
    if (UserRegistry.instance) {
      return UserRegistry.instance;
    }

    UserRegistry.instance = this;
  }

  getUser(user_id) {
    if (!this.#users.has(user_id)) {
      this.#users.set(user_id, new User(user_id));
    }

    return this.#users.get(user_id);
  }
}

module.exports = UserRegistry;