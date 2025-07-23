import dotenv from 'dotenv';

dotenv.config();

export const Environment = {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sales',
  APP_VERSION: process.env.npm_package_version || '1.0.0',
  APP_NAME: process.env.npm_package_name || 'Sales Order API',
} as const;

export const isDevelopment = Environment.NODE_ENV === 'dev';
export const isProduction = Environment.NODE_ENV === 'prd';

if (!Environment.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}
