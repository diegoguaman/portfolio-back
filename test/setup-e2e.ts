// Setup para tests e2e
// Configura variables de entorno por defecto si no están definidas
// En CI/CD, las variables ya vienen del workflow
// En local, carga del .env o usa defaults

// Solo configura si NO existe (respeta .env y CI)
if (!process.env.DATABASE_URL) {
  // Default para desarrollo local
  process.env.DATABASE_URL =
    'postgresql://postgres:P05t6r3SQL_1994@localhost:5432/portfolio';
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL; // Usa el mismo que DATABASE_URL
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key';
}

if (!process.env.PORT) {
  process.env.PORT = '3000';
}
