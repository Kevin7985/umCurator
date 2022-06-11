class emoji {
  constructor() {
    this.emojiList = require('./emojis.json');
  }

  get(name) {
    if (!this.emojiList[name]) {
      throw 'This emoji not found!';
    }

    return this.emojiList[name];
  }
}

module.exports = emoji;