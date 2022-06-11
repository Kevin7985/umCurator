class KeyboardButton {
  #allowedTypes = ['text', 'request_contact', 'request_location', 'request_poll', 'web_app'];

  #meta = {
    buttonType: 'keyboardButton',
    type: '',
    text: '',
    poll_type: '',
    url: ''
  };

  constructor(type, text, params = {}) {
    if (!this.#allowedTypes.includes(type)) {
      throw 'This button type is not supported!';
    }

    this.#meta.type = type;
    this.#meta.text = text;

    if (this.#meta.type === 'request_poll') {
      this.#meta.poll_type = params.type ? params.type : '';
    }

    if (this.#meta.type === 'web_app') {
      if (!params.url) {
        throw 'Web_app button requires url parameter';
      }

      this.#meta.url = params.url;
    }
  }

  async build() {
    let button = {
      text: this.#meta.text
    };

    let option = true;

    if (this.#meta.type === 'web_app') {
      option = {url: this.#meta.url};
    }

    if (this.#meta.type === 'request_poll') {
      option = {};

      if (this.#meta.poll_type === 'quiz') {
        option = {type: this.#meta.poll_type};
      }
    }

    if (this.#meta.type !== 'text') {
      button[this.#meta.type] = option;
    }

    return button;
  }
}

module.exports = KeyboardButton;

module.exports = KeyboardButton;