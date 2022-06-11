class BotMessage {
  #meta = {
    type: undefined,
    user: {
      id: -1,
      username: undefined,
    },
    chat: {
      id: -1,
      type: undefined,
    },
    message: {
      id: -1,
      date: -1,
      text: undefined
    }
  };

  constructor(type, user, chat, message) {
    this.#meta.type = type;
    this.#meta.user = user;
    this.#meta.chat = chat;
    this.#meta.message = message;
  }

  getType() {
    return this.#meta.type;
  }

  getChat(oaram = null) {
    if (!param) {
      return this.#meta.chat;
    }

    if (!this.#meta.chat[param]) {
      throw 'no such param for object "chat"';
    }

    return this.#meta.chat[param];
  }

  getUser(param = null) {
    if (!param) {
      return this.#meta.user;
    }

    if (!this.#meta.user[param]) {
      throw 'no such param for object "user"';
    }

    return this.#meta.user[param];
  }

  getMessage(param = null) {
    if (!param) {
      return this.#meta.message;
    }

    if (!this.#meta.message[param]) {
      throw 'no such param for object "message"';
    }

    return this.#meta.message[param];
  }
}

module.exports = BotMessage;