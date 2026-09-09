# ⚙️ Configuración Específica - DIAPSA

## 🎯 Paso 1: Identificar el Dominio Real

**IMPORTANTE:** Antes de deployar, necesitas conocer el dominio exacto de producción.

### Opciones comunes:

```
A) www.diapsa.com.mx
B) www.diapsa.com
C) www.diapsa.mx
D) diapsa.com.mx
E) diapsa.com
```

### ¿Cómo verificar?

```bash
# Opción 1: Revisar archivo .env.local
cat /mnt/c/laragon/www/diapsa-frontend/.env.local | grep -i url

# Opción 2: Revisar configuración de Vercel/producción
# (buscar en dashboard de hosting)

# Opción 3: Inspeccionar package.json scripts
cat package.json | grep -i start
```

---

## 🔧 Paso 2: Actualizar middleware.ts

Una vez identificado el dominio, editar `middleware.ts` línea ~54:

### Ejemplo 1: Si el dominio es www.diapsa.com.mx

```typescript
const CANONICAL_DOMAIN = 'www.diapsa.com.mx';
const FORCE_HTTPS = true;
const FORCE_WWW = true;
```

### Ejemplo 2: Si el dominio es diapsa.com (sin www)

```typescript
const CANONICAL_DOMAIN = 'diapsa.com';
const FORCE_HTTPS = true;
const FORCE_WWW = false; // ⚠️ Cambiar a false
```

---

## 📊 Paso 3: Verificar Parámetros Spam Actuales

Según el problema reportado:
- ✅ 97% son `?m=` y `?r=`
- ✅ Total: 2,239 URLs spam

### Revisar Google Search Console

1. Ir a: https://search.google.com/search-console
2. Seleccionar propiedad DIAPSA
3. **Pages** → **Why pages aren't indexed**
4. Click en **"Duplicate without user-selected canonical"**
5. Ver ejemplos de URLs excluidas

### Ajustar SPAM_PARAMS si necesario

Si encuentras otros parámetros spam en GSC, agregarlos:

```typescript
const SPAM_PARAMS = [
  'm',    // ✅ Confirmado (97%)
  'r',    // ✅ Confirmado (97%)
  'l',    // ✅ En lista
  '_g',   // ✅ En lista
  'w',    // ✅ En lista
  
  // ⬇️ AGREGAR SI VES EN GSC:
  // 'ref',
  // 'source',
  // 'campaign_id',
];
```

---

## 🚫 Paso 4: Verificar Rutas Bloqueadas

### Revisar rutas reales de DIAPSA

Según la estructura detectada, las rutas válidas son:

```
✅ /
✅ /acerca-de
✅ /blog
✅ /blog/[slug]
✅ /camaras
✅ /camaras/[slug]
✅ /casos-exito
✅ /casos-exito/[slug]
✅ /contacto
✅ /cursos
✅ /cursos/[slug]
✅ /expo-manufactura
✅ /folletodigital
✅ /metodologia
✅ /productos
✅ /productos/[categoria]
✅ /productos/[categoria]/[producto]
✅ /servicios/*
```

### Rutas spam a bloquear (ya configuradas)

```
🚫 /f/special/*
🚫 /guide/*
🚫 /politician*
🚫 /mandate*
🚫 /sponsor*
🚫 /technical*
🚫 /e/[números]/
```

**⚠️ VERIFICAR:** ¿Hay rutas spam adicionales en GSC?

Si sí, agregar en `middleware.ts`:

```typescript
const SPAM_PATH_PATTERNS = [
  /^\/f\/special\//i,
  /^\/guide\//i,
  /^\/politician/i,
  /^\/mandate/i,
  /^\/sponsor/i,
  /^\/technical/i,
  /^\/e\/\d+\/?$/i,
  /^\/[a-z]\/\d{8,}\/?$/i,
  
  // ⬇️ AGREGAR MÁS SI DETECTAS EN GSC:
  // /^\/admin\//i,
  // /^\/test\//i,
];
```

---

## 🧪 Paso 5: Probar Localmente

### 5.1 Iniciar servidor de desarrollo

```bash
cd /mnt/c/laragon/www/diapsa-frontend
npm run dev
```

### 5.2 Ejecutar tests automatizados

```bash
# En otra terminal
bash test-middleware.sh
```

### 5.3 Tests manuales importantes

**Test A: Ruta válida (debe funcionar)**
```bash
curl -I "http://localhost:3000/cursos"
# Esperar: 200 OK
```

**Test B: Parámetro spam (debe redirigir)**
```bash
curl -I "http://localhost:3000/cursos?m=1"
# Esperar: 301 → http://localhost:3000/cursos
```

**Test C: Ruta bloqueada (debe dar 404)**
```bash
curl -I "http://localhost:3000/f/special/test"
# Esperar: 404 Not Found
```

**Test D: Producto dinámico (debe funcionar)**
```bash
curl -I "http://localhost:3000/productos/herramientas/taladro"
# Esperar: 200 OK (o 404 si no existe, pero NO 301)
```

---

## 🚀 Paso 6: Deploy a Producción

### 6.1 Commit y push

```bash
git status
git add middleware.ts MIDDLEWARE-*.md test-middleware.sh
git commit -m "feat: Add spam URL cleanup middleware

- Redirect 301 para parámetros spam (?m=, ?r=, etc)
- Bloquear rutas spam con 404
- Forzar https://www. canónico
- Soluciona 2,239 URLs spam en GSC"

git push origin seo/cursos-metadata-jsonld-redirects
```

### 6.2 Merge a main/master

```bash
# Opción A: Merge directo (si tienes permiso)
git checkout main
git merge seo/cursos-metadata-jsonld-redirects
git push origin main

# Opción B: Pull Request (recomendado)
# Crear PR en GitHub/GitLab/Bitbucket
# Esperar revisión y merge
```

### 6.3 Verificar deployment

```bash
# Si usas Vercel/Netlify, el deploy es automático
# Verificar en dashboard:
# - Build exitoso
# - Sin errores
# - Middleware incluido en build
```

---

## ✅ Paso 7: Verificación Post-Deploy

### 7.1 Tests en producción (día 1)

**⚠️ REEMPLAZAR www.diapsa.com por tu dominio real**

```bash
# Test 1: Homepage
curl -I "https://www.diapsa.com"
# Esperar: 200 OK

# Test 2: Parámetro spam
curl -I "https://www.diapsa.com/cursos?m=1"
# Esperar: 301 → https://www.diapsa.com/cursos

# Test 3: Sin WWW (debe redirigir)
curl -I "https://diapsa.com/productos"
# Esperar: 301 → https://www.diapsa.com/productos

# Test 4: HTTP (debe redirigir a HTTPS)
curl -I "http://www.diapsa.com/contacto"
# Esperar: 301 → https://www.diapsa.com/contacto

# Test 5: Ruta spam bloqueada
curl -I "https://www.diapsa.com/f/special/test"
# Esperar: 404 Not Found
```

### 7.2 Verificar en Browser

1. Abrir DevTools (F12) → Network tab
2. Visitar: `https://www.diapsa.com/cursos?m=1`
3. Verificar:
   - Status: **301 Moved Permanently**
   - Location: `https://www.diapsa.com/cursos`

### 7.3 Verificar rutas válidas no afectadas

```
✅ https://www.diapsa.com/
✅ https://www.diapsa.com/cursos
✅ https://www.diapsa.com/productos
✅ https://www.diapsa.com/blog
✅ https://www.diapsa.com/contacto
```

Todas deben mostrar **200 OK** (sin redirects).

---

## 📊 Paso 8: Monitorear Google Search Console

### Semana 1

1. Ir a: https://search.google.com/search-console
2. **Pages** → **Why pages aren't indexed**
3. Verificar que:
   - ✅ "Duplicate" empiece a reducir
   - ✅ No aparezcan errores nuevos

### Semana 2-4

1. Monitorear reducción de URLs excluidas:
   - **Antes:** 2,239 excluidas
   - **Meta:** ~50 excluidas (solo legítimas)

2. Verificar indexación correcta:
   - ✅ URLs canónicas indexadas
   - ✅ No duplicados
   - ✅ Crawl budget optimizado

### Mes 2-3

1. Analizar impacto SEO:
   - 📈 Tráfico orgánico
   - 📈 Rankings
   - 📈 CTR en SERPs

---

## 🔧 Configuración Opcional

### A) Remover parámetros UTM (si NO usas analytics)

Si **NO necesitas** tracking de campañas, puedes remover UTMs:

```typescript
const SPAM_PARAMS = [
  'm', 'r', 'l', '_g', 'w',
  'fbclid', 'gclid', 'msclkid',
  // ⬇️ COMENTAR SI NECESITAS UTMs:
  // 'utm_source',
  // 'utm_medium',
  // 'utm_campaign',
  // 'utm_term',
  // 'utm_content',
];
```

### B) Permitir subdominios adicionales

Si tienes subdominios legítimos (ej: `blog.diapsa.com`), ajustar:

```typescript
const isLocalhost = hostname.includes('localhost') || 
                   hostname.includes('127.0.0.1') ||
                   hostname.includes('blog.diapsa.com'); // ⬅️ Agregar subdominios
```

### C) Logging en producción

Si quieres logs detallados en producción:

```typescript
// Opción 1: Mantener console.log (simple)
console.log(`[Middleware] ...`);

// Opción 2: Usar sistema de logging (Sentry, Datadog, etc.)
// import { captureMessage } from '@sentry/nextjs';
// captureMessage(`[Middleware] Spam detected: ${pathname}`);
```

---

## 🐛 Troubleshooting Específico

### Problema: "Can't find CANONICAL_DOMAIN"

**Solución:** Verificar que el dominio esté sin protocolo ni trailing slash:

```typescript
// ❌ MAL
const CANONICAL_DOMAIN = 'https://www.diapsa.com/';

// ✅ BIEN
const CANONICAL_DOMAIN = 'www.diapsa.com';
```

### Problema: Redirect loop infinito

**Causa:** Dominio en middleware no coincide con hostname real.

**Solución:**

```bash
# Verificar hostname real en producción
curl -I https://www.diapsa.com | grep -i host

# Ajustar CANONICAL_DOMAIN para que coincida exactamente
```

### Problema: Rutas válidas dan 404

**Causa:** Patrón regex demasiado amplio en SPAM_PATH_PATTERNS.

**Solución:** Revisar y ajustar regex para ser más específicos.

---

## ✅ Checklist Final DIAPSA

- [ ] **1. CANONICAL_DOMAIN actualizado con dominio real**
- [ ] **2. Tests locales pasando (bash test-middleware.sh)**
- [ ] **3. Rutas válidas verificadas (no afectadas)**
- [ ] **4. Commit y push realizados**
- [ ] **5. Deploy exitoso a producción**
- [ ] **6. Tests en producción pasando**
- [ ] **7. GSC monitoreado (semana 1-4)**
- [ ] **8. Resultados analizados (mes 2-3)**

---

**🚀 LISTO PARA IMPLEMENTAR EN DIAPSA**

**Contacto para soporte:**
- Revisar `MIDDLEWARE-TEST-CASES.md` para más detalles
- Revisar `MIDDLEWARE-IMPLEMENTATION.md` para guía completa
- Revisar `MIDDLEWARE-VISUAL-EXAMPLES.md` para ejemplos

**Fecha de implementación:** 2026-08-18  
**Branch:** seo/cursos-metadata-jsonld-redirects
