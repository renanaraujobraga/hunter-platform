type Environment = Record<string, string | undefined>;

const REQUIRED_VARIABLES = ['DATABASE_URL', 'JWT_SECRET'] as const;

export function validateEnvironment(config: Environment): Environment {
  const missing = REQUIRED_VARIABLES.filter((key) => !config[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}`);
  }

  if (config.NODE_ENV === 'production' && config.JWT_SECRET!.length < 32) {
    throw new Error('JWT_SECRET deve possuir pelo menos 32 caracteres em produção.');
  }

  const port = Number(config.PORT ?? 3333);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT deve ser um número inteiro entre 1 e 65535.');
  }

  const interval = Number(config.HUNTER_SCAN_INTERVAL_MINUTES ?? 15);
  if (!Number.isFinite(interval) || interval < 1) {
    throw new Error('HUNTER_SCAN_INTERVAL_MINUTES deve ser maior ou igual a 1.');
  }

  return {
    ...config,
    PORT: String(port),
    HUNTER_SCAN_INTERVAL_MINUTES: String(interval),
  };
}
