import mongoose, { ConnectionStates } from 'mongoose';
import { DatabaseConnectionInterface } from '@/domain/contracts/database-connection.interface';
import { Environment } from '@/main/config/environment';

export class MongoConnection implements DatabaseConnectionInterface {
  private static instance: MongoConnection | null = null;
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
      const mongoUri = Environment.MONGODB_URI;

      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnectedFlag = true;
      console.log(' MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.isConnectedFlag = false;
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('MongoDB disconnection error:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    const readyState = mongoose.connection.readyState;
    const isConnected = readyState === ConnectionStates.connected;

    return isConnected;
  }
}
