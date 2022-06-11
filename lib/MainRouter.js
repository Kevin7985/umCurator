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
    else if (message.getType() === 'callback') {
      let callback = message.getCallback('data').split('_');
      data.controller = callback[0];
      data.action = callback[1];
      data.payload = callback.splice(2);
    }

    await this.#callController(data);
  }

  async moveByUserState(data) {
    let user = UserRegistry.getUser(data.message.getUser('id'));
    let state = user.getState();

    let new_data = {
      message: data.message,
      controller: state.controller,
      action: state.action,
      payload: state.data.split('_')
    };

    await this.#callController(new_data);
  }

  async #callController(data) {
    ControllerRegistry.getController(data.controller).getAction(data.action, data);
  }
}

module.exports = MainRouter;