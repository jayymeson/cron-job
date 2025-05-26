import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  environment: string;
  logLevel: string;
  timezone: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'debug',
    timezone: process.env.TZ || 'America/Sao_Paulo',
  }),
);
