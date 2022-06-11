const MongoClient = require('mongodb').MongoClient;

class DAL {
  static instance = null;

  constructor() {
    if (DAL.instance) {
      return DAL.instance;
    }

    DAL.instance = this;

    this.dbConnect();
  }

  async dbConnect() {
    const mongoClient = new MongoClient(process.env.MONGOB_LINK);
    this.client = await mongoClient.connect();
    this.db = this.client.db('umCurator');
    await this.enableCollections();
  }

  async enableCollections() {
    this.users = new (require('./Collections/UsersCollection'))(this.db);
  }
}

module.exports = DAL;