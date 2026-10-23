/** Falla rápido al arrancar si falta configuración crítica. */
export const validateEnv = (config: Record<string, unknown>) => {
  const secret = config.JWT_SECRET as string | undefined;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET es obligatorio y debe tener al menos 32 caracteres');
  }
  if (!config.DATABASE_URL && !config.DB_NAME) {
    throw new Error('Configurá DATABASE_URL o DB_HOST/DB_NAME/DB_USER/DB_PASSWORD');
  }
  return config;
};
