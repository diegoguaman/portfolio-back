// Setup para tests e2e
// Configura variables de entorno por defecto si no están definidas
// Para sobreescribir, crea un archivo .env en la raíz del proyecto

// Solo configura si NO existe (respeta .env)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:P05t6r3SQL_1994@localhost:5432/portfolio';
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL =
    'postgresql://postgres:P05t6r3SQL_1994@localhost:5432/portfolio';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key';
}

if (!process.env.PORT) {
  process.env.PORT = '3000';
}
