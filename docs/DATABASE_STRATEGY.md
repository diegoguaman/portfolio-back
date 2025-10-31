# 🗄️ Estrategia Profesional de Bases de Datos

## 📋 **Resumen por Entorno**

| Entorno | Base de Datos | Dónde | Por qué |
|---------|--------------|-------|---------|
| **Desarrollo Local** | 🐳 Docker PostgreSQL | Tu máquina | Rápido, aislado, reproducible |
| **Tests Unitarios** | ❌ Sin BD | En memoria (mocks) | Rápido, no depende de externos |
| **Tests Integración/E2E** | 🐳 Docker PostgreSQL | Tu máquina / CI | Prueba real, consistente |
| **CI/CD (GitHub Actions)** | 🐳 Service PostgreSQL | GitHub runners | Temporal, automático |
| **Staging** | ☁️ Base de datos en nube | Supabase/Railway/Render | Pre-producción realista |
| **Producción** | ☁️ Base de datos gestionada | Supabase/Railway/Render | Alta disponibilidad, backups |

---

## 🔧 **1. Desarrollo Local (Docker) - LO QUE TIENES**

### ✅ **Ventajas**
- Aislado de tu sistema
- Fácil de resetear
- Misma versión que producción
- No cuesta dinero
- Funciona sin internet

### ⚙️ **Configuración**

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: P05t6r3SQL_1994
      POSTGRES_DB: portfolio
    ports:
      - '5432:5432'
    volumes:
      - db_data:/var/lib/postgresql/data
```

```env
# .env (local)
DATABASE_URL="postgresql://postgres:P05t6r3SQL_1994@localhost:5432/portfolio"
```

### 🚀 **Comandos**

```bash
# Iniciar
docker-compose up -d db

# Ver logs
docker-compose logs -f db

# Reiniciar (mantiene datos)
docker-compose restart db

# Reiniciar limpio (borra datos)
docker-compose down
docker volume rm portfolio-backend_db_data
docker-compose up -d db
npx prisma migrate deploy
```

---

## ☁️ **2. Producción (Base de Datos en la Nube)**

### 🎯 **Opciones Recomendadas**

#### **Opción A: Supabase** (Recomendado para portfolios)
- ✅ **Gratis**: 500 MB, 2 proyectos
- ✅ Backups automáticos
- ✅ Dashboard visual
- ✅ API REST automática
- ✅ Muy fácil de configurar
- 📍 https://supabase.com

**Setup:**
```bash
1. Crear cuenta en Supabase
2. Crear proyecto
3. Copiar "Connection String" (URI mode)
4. Agregar a Render como variable de entorno
```

#### **Opción B: Railway** (Muy simple)
- ✅ **Gratis**: $5 crédito mensual
- ✅ Muy fácil deployment
- ✅ Integración con GitHub
- 📍 https://railway.app

#### **Opción C: Render PostgreSQL**
- ✅ **Gratis**: 90 días luego expira
- ✅ Mismo servicio que tu backend
- ⚠️ Se elimina después de 90 días en plan gratuito
- 📍 https://render.com

#### **Opción D: Neon** (Serverless)
- ✅ **Gratis**: 3 GB, branching
- ✅ Auto-pausa (ahorra recursos)
- ✅ Rápido
- 📍 https://neon.tech

---

## 🔐 **3. Variables de Entorno por Entorno**

### **Desarrollo Local (.env)**
```env
DATABASE_URL="postgresql://postgres:P05t6r3SQL_1994@localhost:5432/portfolio"
DIRECT_URL="postgresql://postgres:P05t6r3SQL_1994@localhost:5432/portfolio"
JWT_SECRET="dev-secret-change-in-prod"
PORT=3000
N8N_WEBHOOK_URL="http://localhost:5678/webhook/form"
```

### **Producción (Render/Variables de Entorno)**
```env
DATABASE_URL="postgresql://user:pass@postgres.supabase.co:5432/postgres"
DIRECT_URL="postgresql://user:pass@postgres.supabase.co:5432/postgres"
JWT_SECRET="super-secret-production-key-min-32-chars"
PORT=10000
N8N_WEBHOOK_URL="https://your-n8n.com/webhook/form"
```

### **CI/CD (GitHub Actions)**
```yaml
# Ya configurado automáticamente en .github/workflows/ci.yml
DATABASE_URL: postgresql://postgres:postgres@localhost:5432/portfolio
```

---

## 🏢 **4. Flujo Profesional Completo**

```
┌─────────────────┐
│  Desarrollo     │
│  Local          │
│  🐳 Docker      │
└────────┬────────┘
         │ git push
         ▼
┌─────────────────┐
│  CI/CD          │
│  GitHub Actions │
│  🐳 Service     │
└────────┬────────┘
         │ tests pass
         ▼
┌─────────────────┐
│  Staging        │  (opcional)
│  ☁️ Supabase    │
└────────┬────────┘
         │ manual approval
         ▼
┌─────────────────┐
│  Producción     │
│  ☁️ Supabase    │
└─────────────────┘
```

---

## 📊 **5. Comparación de Costos**

| Servicio | Plan Gratuito | Límites | Mejor Para |
|----------|--------------|---------|------------|
| **Supabase** | ✅ Gratis forever | 500 MB, 2 proyectos | Portfolios, MVPs |
| **Railway** | $5/mes crédito | Luego paga | Startups |
| **Render** | 90 días | Luego expira | Demos temporales |
| **Neon** | ✅ Gratis forever | 3 GB | Serverless apps |
| **Planetscale** | Plan cambió | Ya no tan generoso | - |

---

## 🎯 **6. Recomendación para tu Portfolio**

### **Para Desarrollo**
✅ **Docker** (lo que ya tienes) - PERFECTO

### **Para Producción**
✅ **Supabase** - MEJOR OPCIÓN

**Por qué Supabase:**
1. Gratis forever (500 MB es más que suficiente para portfolio)
2. Backups automáticos
3. SSL incluido
4. Dashboard para ver datos
5. Muy fácil de configurar
6. No expira como Render

---

## 🚀 **7. Setup de Supabase (5 minutos)**

### **Paso 1: Crear Cuenta**
```
1. Ve a https://supabase.com
2. Sign up con GitHub
3. Crear nuevo proyecto
   - Nombre: portfolio-backend
   - Database Password: (guarda esto)
   - Región: Europe West (Amsterdam) o la más cercana
```

### **Paso 2: Obtener Connection String**
```
1. Settings → Database
2. Copiar "URI" en Connection String
3. Debería verse así:
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### **Paso 3: Configurar en Render**
```
1. Dashboard de Render → Tu servicio
2. Environment → Add Environment Variable
3. Agregar:
   - DATABASE_URL = [tu connection string de Supabase]
   - DIRECT_URL = [misma connection string]
```

### **Paso 4: Deploy**
```bash
# Ejecutar migraciones en Supabase
DATABASE_URL="tu-supabase-url" npx prisma migrate deploy

# O desde Render (después del primer deploy):
# Las migraciones se ejecutan automáticamente si agregas
# un script en package.json
```

---

## 🔒 **8. Seguridad**

### **❌ NUNCA hacer:**
- Commitear archivos `.env` con credenciales reales
- Usar la misma contraseña en dev y prod
- Exponer DATABASE_URL en logs públicos

### **✅ SIEMPRE hacer:**
- Usar variables de entorno
- Contraseñas fuertes en producción
- SSL/TLS en conexiones de producción
- Backups regulares (Supabase lo hace automáticamente)

---

## 📝 **9. Checklist de Migración a Producción**

```bash
✅ Base de datos en nube creada (Supabase)
✅ Connection string guardada de forma segura
✅ Variables de entorno configuradas en Render
✅ Migraciones aplicadas
✅ Tests pasando en CI/CD
✅ Backup configurado (automático en Supabase)
✅ Monitoreo activo (Supabase dashboard)
```

---

## 🆘 **10. Troubleshooting Común**

### **Error: Can't reach database**
```bash
# Verificar que Docker esté corriendo
docker ps

# Verificar credenciales en .env
cat .env | grep DATABASE_URL

# Recrear contenedor
docker-compose down
docker volume rm portfolio-backend_db_data
docker-compose up -d db
npx prisma migrate deploy
```

### **Error: User denied access**
```bash
# Credenciales no coinciden entre docker-compose.yml y .env
# Asegúrate de usar:
# POSTGRES_USER: postgres (en docker-compose.yml)
# DATABASE_URL con usuario postgres (en .env)
```

### **Error en producción: Connection pool exhausted**
```bash
# Agregar connection pool en DATABASE_URL
?connection_limit=5&pool_timeout=2
```

---

## 📚 **11. Recursos**

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Deploy](https://www.prisma.io/docs/guides/deployment)
- [Docker Postgres](https://hub.docker.com/_/postgres)
- [12 Factor App](https://12factor.net/) - Metodología profesional

---

**Resumen:** Docker para desarrollo local es profesional y correcto. Supabase para producción es la mejor opción para portfolios. ✅

