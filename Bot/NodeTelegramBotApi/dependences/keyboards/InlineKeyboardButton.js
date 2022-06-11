class InlineKeyboardButton {
  #allowedTypes = ['callback_data', 'url', 'web_app', 'login_url', 'switch_inline_query', 'switch_inline_query_current_chat'];

  #meta = {
    type: '',
    text: '',
    callback_data: '',
    url: '',
    login_url: {},
    switch_inline_query: '',
    switch_inline_query_current_chat: ''
  };

  constructor(type, text, params) {
    if (this.#allowedTypes.indexOf(type) === -1) {
      throw 'This button type is not supported!';
    }

    if (!params) {
      throw 'All button types requires params!';
    }

    if (type === 'callback_data' && !params.callback_data) {
      throw 'This button type requires field \"callback_data\"';
    }

    if ((type === 'url' || type === 'web_app' || type === 'login_url') && !params.url) {
      throw 'This button type requires field \"url\"';
    }

    this.#meta.type = type;
    this.#meta.text = text;
    this.#meta.callback_data = params.callback_data;
    this.#meta.url = params.url;
    this.#meta.switch_inline_query = params.switch_inline_query;
    this.#meta.switch_inline_query_current_chat = params.switch_inline_query_current_chat;

    // for login_url
    this.#meta.login_url.forward_text = params.forward_text;
    this.#meta.login_url.bot_username = params.bot_username;
    this.#meta.login_url.request_write_access = params.request_write_access;
  }

  async build() {
    let button = {
      text: this.#meta.text
    };

    if (this.#meta.type !== 'web_app' && this.#meta.type !== 'login_url') {
      button[this.#meta.type] = this.#meta[this.#meta.type];
    }
    else if (this.#meta.type === 'web_app') {
      button.web_app = {url: this.#meta.url};
    }
    else if (this.#meta.type === 'login_url') {
      button.login_url = this.#meta.login_url;
      button.login_url.url = this.#meta.url;
    }

    return button;
  }
}

module.exports = InlineKeyboardButton;