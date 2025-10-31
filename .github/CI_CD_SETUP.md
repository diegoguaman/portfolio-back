# CI/CD Setup Guide

## GitHub Actions Variables de Entorno

Para que el CI/CD funcione correctamente, necesitas configurar los siguientes secretos en GitHub:

### Ir a: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### Secrets Requeridos

#### Para Tests de Integración
- `POSTGRES_PASSWORD`: Contraseña para PostgreSQL en tests de integración (ej: `postgres`)

#### Para Deploy en Render
- `RENDER_API_KEY`: Tu API key de Render
- `RENDER_SERVICE_ID`: El ID de tu servicio en Render

### Variables de Entorno Opcionales

Estas ya están configuradas en el workflow con valores por defecto para CI:
- `DATABASE_URL`: Configurado automáticamente para tests
- `JWT_SECRET`: Configurado automáticamente para tests

## Estructura del CI/CD

El pipeline tiene los siguientes jobs:

### 1. **Lint**
- Ejecuta ESLint para verificar la calidad del código
- Usa Node.js 20.x
- Cache de npm para velocidad

### 2. **Unit Tests**
- Ejecuta tests unitarios con cobertura
- Matrix strategy: Node.js 18.x y 20.x
- **NO requiere base de datos** (excluye `*.integration.spec.ts`)
- Verifica que la cobertura sea >= 95%
- Sube reportes de cobertura como artifacts

### 3. **Integration Tests**
- Ejecuta tests de integración y e2e
- **Requiere PostgreSQL** (servicio docker en el runner)
- Solo Node.js 20.x
- Ejecuta migraciones de Prisma antes de los tests

### 4. **Build**
- Compila la aplicación
- Verifica que el build sea exitoso
- Sube artifacts del build

### 5. **Coverage Report**
- Sube la cobertura a Codecov (opcional)

### 6. **Deploy**
- Solo se ejecuta en push a `main`
- Hace deploy automático a Render
- Necesita `RENDER_API_KEY` y `RENDER_SERVICE_ID`

## Cómo funciona la separación de tests

### Tests Unitarios (`test:unit`)
- Archivo de configuración: `jest-unit.config.ts`
- Excluye archivos: `*.integration.spec.ts`
- No necesita base de datos
- Más rápidos
- Ejecutan mocks de todas las dependencias

### Tests de Integración (`test:integration`)
- Archivo de configuración: `jest-integration.config.ts`
- Solo ejecuta: `*.integration.spec.ts`
- Requiere PostgreSQL corriendo
- Prueban la integración real con la base de datos

### Tests E2E (`test:e2e`)
- Archivo de configuración: `test/jest-e2e.json`
- Prueban la aplicación completa end-to-end

## Triggers

El CI/CD se ejecuta en:
- **Push** a la rama `main`
- **Pull Requests** hacia `main`

## Comandos Locales

```bash
# Tests unitarios (sin DB)
npm run test:unit

# Tests de integración (requiere DB)
npm run test:integration

# Tests e2e
npm run test:e2e

# Todos los tests
npm test

# Con cobertura
npm run test:unit -- --coverage
```

## Troubleshooting

### Error: "Can't reach database server"
- Asegúrate de que PostgreSQL esté corriendo si ejecutas tests de integración localmente
- En CI, verifica que el servicio PostgreSQL esté configurado correctamente

### Error: "Coverage below 95%"
- Agrega más tests unitarios
- Verifica qué archivos no tienen cobertura con `npm run test:cov`

### Error: "RENDER_API_KEY not found"
- Configura el secret en GitHub Settings → Secrets

## Métricas de Calidad

El CI/CD garantiza:
- ✅ Código sin errores de linting
- ✅ Cobertura de tests >= 95%
- ✅ Tests unitarios pasando en Node 18.x y 20.x
- ✅ Tests de integración pasando
- ✅ Build exitoso
- ✅ Deploy automático a producción (solo en main)

