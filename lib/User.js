class User {
  #meta = {
    user_id: -1,
    state: {
      controller: undefined,
      action: undefined,
      data: '',
      stateString: ''
    }
  };

  constructor(user_id) {
    this.#meta.user_id = user_id;
  }

  getUserId() {
    return this.#meta.user_id;
  }

  setState(controller, action, data = '') {
    this.#meta.state = {
      controller: controller,
      action: action,
      data: data || '',
      stateString: `${controller}_${action}_${data}`
    };
  }

  getState() {
    return this.#meta.state;
  }
}

module.exports = User;