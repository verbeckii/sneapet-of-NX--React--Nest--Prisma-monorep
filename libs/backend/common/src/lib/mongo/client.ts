import { MongoClient, Db } from 'mongodb';

const poolSize = parseInt(process.env.MONGO_POOL_SIZE) || 5;

class MongoDbConnection {
  private db: Db;
  
  async mongoConnect(): Promise<Db> {
    try {
      const client = new MongoClient(process.env.MONGO_URL, {
        minPoolSize: poolSize,
        connectTimeoutMS: 120000,
        socketTimeoutMS: 1440000,
      });
      await client.connect();
      const db = client.db();
      this.db = db;
      return db;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getDb(): Db | Promise<Db> {
    return this.db ? this.db : this.mongoConnect();
  }
}

const mongo = new MongoDbConnection();
export { mongo };
