# 🛡️ Middleware de Limpieza de URLs - Casos de Prueba

## 📋 Configuración Requerida

**IMPORTANTE:** Antes de deployar a producción, actualizar en `middleware.ts`:

```typescript
const CANONICAL_DOMAIN = 'www.diapsa.com'; // ⚠️ Cambiar por tu dominio real
```

---

## ✅ Casos de Prueba - URLs SPAM (Deben redirigir o bloquear)

### 1️⃣ Parámetros Query Spam → Redirect 301 a URL Limpia

| URL Original | URL Final Esperada | Status |
|--------------|-------------------|---------|
| `https://www.diapsa.com/cursos?m=1` | `https://www.diapsa.com/cursos` | 301 |
| `https://www.diapsa.com/productos?r=abc` | `https://www.diapsa.com/productos` | 301 |
| `https://www.diapsa.com/contacto?l=test` | `https://www.diapsa.com/contacto` | 301 |
| `https://www.diapsa.com/?_g=123` | `https://www.diapsa.com/` | 301 |
| `https://www.diapsa.com/nosotros?w=xyz` | `https://www.diapsa.com/nosotros` | 301 |

Los parametros de campana y analitica NO se eliminan, a proposito:

| URL Original | URL Final Esperada | Status |
|--------------|-------------------|---------|
| `https://www.diapsa.com/blog?fbclid=IwAR123` | sin cambio | 200 |
| `https://www.diapsa.com/blog?utm_source=test&utm_campaign=x` | sin cambio | 200 |

Removerlos con un 301 rompe la atribucion en GA4 y en Google/Meta Ads,
porque el parametro desaparece antes de que la pagina cargue y el tag lo
lea. Para SEO no hacen falta: Google los consolida en la URL canonica.


**Múltiples parámetros spam:**
```
https://www.diapsa.com/productos?m=1&r=2&l=3
→ https://www.diapsa.com/productos (301)
```

**Mix spam + legítimo (si tienes parámetros válidos):**
```
https://www.diapsa.com/buscar?q=tornillos&m=1
→ https://www.diapsa.com/buscar?q=tornillos (301)
```

---

### 2️⃣ Rutas Spam → Bloqueo 404

| URL | Status Esperado | Motivo |
|-----|----------------|---------|
| `https://www.diapsa.com/f/special/test` | 404 | Patrón `/f/special/*` |
| `https://www.diapsa.com/f/special/abc/def` | 404 | Patrón `/f/special/*` |
| `https://www.diapsa.com/guide/something` | 404 | Patrón `/guide/*` |
| `https://www.diapsa.com/politician-test` | 404 | Patrón `/politician*` |
| `https://www.diapsa.com/politicians` | 404 | Patrón `/politician*` |
| `https://www.diapsa.com/mandate-123` | 404 | Patrón `/mandate*` |
| `https://www.diapsa.com/sponsor-abc` | 404 | Patrón `/sponsor*` |
| `https://www.diapsa.com/technical-docs` | 404 | Patrón `/technical*` |
| `https://www.diapsa.com/e/12345678/` | 404 | Patrón `/e/[números]/` |
| `https://www.diapsa.com/e/999/` | 404 | Patrón `/e/[números]/` |
| `https://www.diapsa.com/x/12345678/` | 404 | Letra + 8+ dígitos |

---

### 3️⃣ Forzar HTTPS y WWW → Redirect 301

| URL Original | URL Final Esperada | Status |
|--------------|-------------------|---------|
| `http://diapsa.com/` | `https://www.diapsa.com/` | 301 |
| `http://www.diapsa.com/` | `https://www.diapsa.com/` | 301 |
| `https://diapsa.com/` | `https://www.diapsa.com/` | 301 |
| `http://diapsa.com/cursos` | `https://www.diapsa.com/cursos` | 301 |
| `https://diapsa.com/productos?m=1` | `https://www.diapsa.com/productos` | 301 |

**⚠️ NOTA:** En localhost estas reglas NO aplican para facilitar desarrollo.

---

## ✅ Casos de Prueba - URLs VÁLIDAS (Deben funcionar normal)

### URLs Legítimas (200 OK - sin redirect)

| URL | Status Esperado | Motivo |
|-----|----------------|---------|
| `https://www.diapsa.com/` | 200 | Homepage |
| `https://www.diapsa.com/cursos` | 200 | Ruta válida |
| `https://www.diapsa.com/productos` | 200 | Ruta válida |
| `https://www.diapsa.com/productos/categoria/tornillos` | 200 | Ruta dinámica válida |
| `https://www.diapsa.com/blog` | 200 | Ruta válida |
| `https://www.diapsa.com/contacto` | 200 | Ruta válida |

### Recursos Estáticos (Excluidos del middleware)

| Recurso | Procesado por Middleware |
|---------|--------------------------|
| `/api/contacto` | ❌ NO (excluido) |
| `/_next/static/...` | ❌ NO (excluido) |
| `/_next/image/...` | ❌ NO (excluido) |
| `/favicon.ico` | ❌ NO (excluido) |
| `/robots.txt` | ❌ NO (excluido) |
| `/sitemap.xml` | ❌ NO (excluido) |
| `/logo.png` | ❌ NO (extensión archivo) |
| `/styles.css` | ❌ NO (extensión archivo) |

---

## 🧪 Cómo Probar

### Opción 1: Desarrollo Local (npm run dev)

```bash
# Nota: En localhost las reglas de HTTPS/WWW NO aplican

# Probar parámetros spam
curl -I "http://localhost:3000/cursos?m=1"
# Esperar: 301 → http://localhost:3000/cursos

# Probar rutas bloqueadas
curl -I "http://localhost:3000/f/special/test"
# Esperar: 404

# Probar ruta válida
curl -I "http://localhost:3000/cursos"
# Esperar: 200
```

### Opción 2: Inspeccionar en Browser DevTools

1. Abrir DevTools (F12) → Network tab
2. Visitar URLs de prueba
3. Verificar status codes (301, 404, 200)
4. Revisar header `Location` en redirects 301

### Opción 3: Build de Producción

```bash
npm run build
npm run start

# Probar con curl o browser en http://localhost:3000
```

---

## 📊 Estadísticas Esperadas

**Problema Actual (según Google Search Console):**
- ✅ 2,239 URLs spam sin indexar
- ✅ 97% son parámetros `?m=` y `?r=`

**Resultado Esperado después de Middleware:**
1. ✅ Todos los parámetros spam → **Redirect 301** a URL limpia
2. ✅ Rutas spam → **404** (no indexables)
3. ✅ URLs canónicas → **https://www.**
4. ✅ Google Search Console debería ver reducción de "excluded URLs" en 2-4 semanas

---

## ⚙️ Personalización

### Agregar más parámetros spam

En `middleware.ts`, actualizar:

```typescript
const SPAM_PARAMS = [
  'm', 'r', 'l', '_g', 'w',
  // Agregar más aquí. NO agregar utm_*, gclid, fbclid ni msclkid:
  // rompen la atribucion de campanas.
  'ref', 'source', 'campaign_id'
];
```

### Agregar más rutas bloqueadas

```typescript
const SPAM_PATH_PATTERNS = [
  /^\/f\/special\//i,
  /^\/guide\//i,
  // Agregar más aquí:
  /^\/admin\//i,        // Bloquear /admin/*
  /^\/wp-admin\//i,     // Bloquear intentos WordPress
];
```

### Permitir parámetros legítimos (NO eliminar)

Si tienes parámetros query válidos en tu app (ej: `?page=2`, `?categoria=tornillos`), el middleware ya los preserva automáticamente.

**Solo se eliminan** los parámetros listados en `SPAM_PARAMS`.

---

## 🚀 Deploy Checklist

- [ ] **1. Actualizar dominio en middleware.ts**
  ```typescript
  const CANONICAL_DOMAIN = 'www.diapsa.com'; // ⚠️ TU DOMINIO REAL
  ```

- [ ] **2. Revisar parámetros spam** - ¿Hay más que eliminar? ¿Alguno es legítimo?

- [ ] **3. Revisar rutas bloqueadas** - ¿Son todas spam? ¿Falta alguna?

- [ ] **4. Probar en staging/producción:**
  - Rutas válidas funcionan ✅
  - Parámetros spam → 301 ✅
  - Rutas spam → 404 ✅
  - HTTPS/WWW funcionando ✅

- [ ] **5. Monitorear Google Search Console** (2-4 semanas)
  - Verificar reducción de URLs excluidas
  - Verificar que URLs legítimas se indexan correctamente

---

## 🐛 Troubleshooting

### ❌ Problema: Redirect loop infinito

**Causa:** Dominio mal configurado o hostname no coincide.

**Solución:**
```typescript
// Verificar que el dominio coincida exactamente
const CANONICAL_DOMAIN = 'www.tudominio.com'; // Sin https://, sin trailing slash
```

### ❌ Problema: Rutas válidas bloqueadas

**Causa:** Patrón regex demasiado amplio.

**Solución:** Revisar y ajustar `SPAM_PATH_PATTERNS`, usar regex más específicos.

### ❌ Problema: Parámetros legítimos eliminados

**Causa:** Parámetro añadido por error en `SPAM_PARAMS`.

**Solución:** Remover el parámetro de la lista o ajustar lógica de detección.

---

## 📝 Logs de Debugging

El middleware incluye `console.log()` para debugging. En producción, considera removerlos o usar un sistema de logging apropiado.

Ver logs en desarrollo:
```bash
npm run dev
# Revisar terminal donde corre Next.js
```

---

**✅ LISTO PARA IMPLEMENTAR**
