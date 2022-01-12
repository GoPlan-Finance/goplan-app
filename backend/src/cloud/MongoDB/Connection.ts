import { MongoClient } from 'mongodb';

class Connection {
  static client: MongoClient;

  static async open(databaseUri: string): Promise<MongoClient> {
    if (this.client) {
      return this.client;
    }
    Connection.client = new MongoClient(databaseUri, {});
    await Connection.client.connect();

    return Connection.client;
  }
}

export { Connection };
