export interface HealthStatusInterface {
  status: 'OK' | 'FAIL';
  db: 'OK' | 'FAIL';
  timestamp?: string;
  app?: string;
  version?: string;
  environment?: string;
  error?: string;
}
