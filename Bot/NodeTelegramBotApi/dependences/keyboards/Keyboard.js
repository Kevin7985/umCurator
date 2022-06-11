class Keyboard {
  #allowedTypes = ['keyboard', 'remove_keyboard', 'inline_keyboard'];

  #buttonTypes = {
    keyboard: require('./KeyboardButton'),
    inline_keyboard: require('./InlineKeyboardButton')
  };

  #meta = {
    type: '',
    buttons: [],
    resize_keyboard: false,
    one_time_keyboard: false,
    input_field_placeholder: '',
    selective: false
  };

  constructor(type, params = {}) {
    if (!this.#allowedTypes.includes(type)) {
      throw 'This keyboard type is not supported!';
    }

    this.#meta.type = type;
    this.#meta.resize_keyboard = params.resize_keyboard ? params.resize_keyboard : false;
    this.#meta.one_time_keyboard = params.one_time_keyboard ? params.one_time_keyboard : false;
    this.#meta.input_field_placeholder = params.input_field_placeholder ? params.input_field_placeholder : '';
    this.#meta.selective = params.selective ? params.selective : false;
  }

  async Button() {
    if (this.#meta.type === 'remove_keyboard') {
      throw 'This keyboard type does not support buttons!';
    }

    return this.#buttonTypes[this.#meta.type];
  }

  async build(buttons) {
    let object = {
      reply_markup: {}
    };

    let result = undefined;

    if (this.#meta.type === 'remove_keyboard') {
      result = true;
    }
    else {
      result = [];

      for (let i = 0; i < buttons.length; i++) {
        result.push([]);

        for (const button of buttons[i]) {
          result[i].push(await button.build());
        }
      }
    }

    object.reply_markup[this.#meta.type] = result;

    if (this.#meta.type === 'keyboard') {
      object.reply_markup.resize_keyboard = this.#meta.resize_keyboard;
      object.reply_markup.one_time_keyboard = this.#meta.one_time_keyboard;
      object.input_field_placeholder = this.#meta.input_field_placeholder;
      object.selective = this.#meta.selective;
    }

    return object;
  }
}

module.exports = Keyboard;