# Configuración de Variables de Entorno

Este proyecto usa variables de entorno para configurar diferentes entornos (desarrollo, producción).

## Archivos de Entorno

- **`.env.example`** - Template con todas las variables disponibles (se sube a git)
- **`.env.local`** - Configuración de desarrollo local (NO se sube a git)
- **Variables de producción** - Se configuran en la plataforma de deployment (Vercel, etc.)

## Setup Inicial (Desarrollo)

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tu configuración local (ya está preconfigurado con valores por defecto)

## Variables Disponibles

### `NEXT_PUBLIC_API_BASE_URL`
URL base de la API backend.

- **Desarrollo:** `http://grupodiapsa.test/api/v1`
- **Producción:** `https://cms.grupodiapsa.com.mx/api/v1`

### `NEXT_PUBLIC_API_TIMEOUT` (opcional)
Timeout de requests en milisegundos.

- **Default:** `10000` (10 segundos)

## Configuración por Entorno

### Desarrollo Local
Las variables se toman de `.env.local` automáticamente.

```bash
npm run dev
```

### Producción (Vercel/Deploy)
Configura las variables de entorno en tu plataforma:

1. **Vercel:** Settings > Environment Variables
2. Agrega:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://cms.grupodiapsa.com.mx/api/v1`
   - `NEXT_PUBLIC_API_TIMEOUT` = `10000` (opcional)

## Notas Importantes

- ✅ Variables con prefijo `NEXT_PUBLIC_*` son visibles en el cliente (browser)
- ✅ `.env.local` está en `.gitignore` (NO se sube a git)
- ✅ Si no se define `NEXT_PUBLIC_API_BASE_URL`, el fallback es producción por seguridad
- ✅ Next.js carga automáticamente las variables según el entorno
