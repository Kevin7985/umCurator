const ControllerRegistry = new (require('./ControllerRegistry')) ();
const UserRegistry = new (require('./UserRegistry')) ();

class MainRouter {
  constructor() { }

  async performCommandByData(message) {
    let data = {
      message: message,
      controller: undefined,
      action: undefined,
      payload: undefined
    };

    if (message.getType() === 'text') {
      let command = new RegExp('\\/(.+)', 'g');
      let text = message.getMessage('text');

      let found_command = text.match(command);

      if (!found_command) {
        let user = UserRegistry.getUser(message.getUser('id'));
        let user_state = user.getState();

        if (!user_state.stateString) {
          return;
        }
        else {
          data.controller = user_state.controller;
          data.action = user_state.action;
          data.payload = user_state.data.split('_');
        }
      }
      else {
        data.controller = found_command[0].split(' ')[0].substr(1);
        data.action = 'init';
        data.payload = found_command[0].split(' ')[1] || null;
      }
    }

    await this.#callController(data);
  }

  async moveByUserState(data) {
    let user = UserRegistry.getUser(data.message.getUser('id'));
    let state = user.getState();

    state.message = data.message;

    await this.#callController(state);
  }

  async #callController(data) {
    ControllerRegistry.getController(data.controller).getAction(data.action, data);
  }
}

module.exports = MainRouter;