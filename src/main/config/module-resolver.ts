import { isProduction } from './environment';

if (isProduction) {
  require('module-alias/register');
}
