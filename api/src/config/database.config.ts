import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

/**
 * Configuración compartida entre la app Nest y la CLI de TypeORM (migraciones/seed).
 * Nunca usamos `synchronize`: el esquema se versiona con migraciones.
 */
export const buildDataSourceOptions = (env: NodeJS.ProcessEnv = process.env): DataSourceOptions => {
  const ssl = env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false;
  const connection = env.DATABASE_URL
    ? { url: env.DATABASE_URL }
    : {
        host: env.DB_HOST ?? 'localhost',
        port: Number(env.DB_PORT ?? 5432),
        username: env.DB_USER ?? 'postgres',
        password: env.DB_PASSWORD ?? '',
        database: env.DB_NAME ?? 'noir_atelier',
      };

  return {
    type: 'postgres',
    ...connection,
    ssl,
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
    synchronize: false,
    logging: env.DB_LOGGING === 'true',
  };
};
