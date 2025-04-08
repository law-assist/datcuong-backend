import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const AppDataSource = new DataSource({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  username: '',
  password: '',
  database: 'law_linking',
  entities: [`${__dirname}/../**/*.schema{.ts,.js}`],
  synchronize: true,
  logging: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  subscribers: [],
});
