export interface DatabaseConnectionInterface {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}
