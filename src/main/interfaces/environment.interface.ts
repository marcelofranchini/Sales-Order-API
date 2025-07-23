export interface EnvironmentInterface {
  MONGO_DB: string;
  PORT: number;
  NODE_ENV: 'dev' | 'prd';
  APP_NAME: string;
  APP_VERSION: string;
}
