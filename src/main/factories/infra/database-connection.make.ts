import { DatabaseConnectionInterface } from '@/domain/contracts/database-connection.interface';
import { MongoConnection } from '@/infra/db/mongoose/mongo-connection';

export class MakeDatabaseConnection {
  static create(): DatabaseConnectionInterface {
    return MongoConnection.getInstance();
  }
}
