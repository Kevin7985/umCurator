const {ObjectId} = require("mongodb");

class UsersCollection {
  static instance = null;

  constructor(db) {
    if (UsersCollection.instance) {
      return UsersCollection.instance;
    }

    UsersCollection.instance = this;

    this.db = db;
    this.collection = this.db.collection('users');
  }

  async findUserByTelegramId(telegram_id) {
    return (await this.collection.findOne({telegram_id: telegram_id}));
  }

  async findUserBy_Id(_id) {
    return (await this.collection.findOne({_id: ObjectId(_id)}));
  }
}

module.exports = UsersCollection;