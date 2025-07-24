import mongoose from 'mongoose';
import { DatabaseConnectionInterface } from '../../../domain/contracts/database-connection.interface';
import { Environment } from '../../../main/config/environment';

export class MongoConnection implements DatabaseConnectionInterface {
  private static instance: MongoConnection;
  private isConnectedFlag = false;

  private constructor() {}

  static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  async connect(): Promise<void> {
    try {
      if (this.isConnectedFlag) {
        return;
      }

      await mongoose.connect(Environment.MONGODB_URI);
      this.isConnectedFlag = true;
      console.log(' MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (!this.isConnectedFlag) {
        return;
      }

      await mongoose.disconnect();
      this.isConnectedFlag = false;
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.isConnectedFlag;
  }
}
