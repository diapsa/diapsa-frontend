# SEO Implementation - Grupo DIAPSA

## ✅ Implementaciones Completadas

### 1. Metadata Global (layout.tsx)
- `lang="es-MX"` configurado
- `metadataBase` para URLs absolutas
- `title.template` para títulos consistentes
- `description` y `keywords` corporativos
- OpenGraph y Twitter Cards configurados
- Viewport y theme-color
- Robots index/follow habilitados
- Manifest PWA referenciado

### 2. Archivos SEO Fundamentales
- `app/sitemap.ts` - Sitemap dinámico con todas las rutas
- `app/robots.ts` - Configuración para crawlers
- `public/manifest.json` - PWA manifest

### 3. Datos Estructurados (JSON-LD)
- `components/atoms/JsonLd.tsx` - Componente reutilizable
- Schema `Organization` en layout global
- Schema `LocalBusiness` en layout global
- Schema `WebSite` en layout global
- Schema `Product` en páginas de cámaras
- Schema `Service` en páginas de servicios
- Schema `BreadcrumbList` en páginas con breadcrumbs

### 4. Metadata por Página
| Página | Title | Description | Keywords | OpenGraph | Canonical |
|--------|-------|-------------|----------|-----------|-----------|
| `/` (Home) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/acerca-de` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/metodologia` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/cursos` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/camaras` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/camaras/[slug]` | ✅ Dinámico | ✅ | ✅ | ✅ | ✅ |
| `/servicios-productos` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/servicios-productos/[slug]` | ✅ Dinámico | ✅ | ✅ | ✅ | ✅ |

### 5. Semántica HTML
- Todas las páginas usan `<main>` como contenedor principal
- Headers, sections, articles estructurados correctamente

---

## ⏳ Pendientes (Requieren Acción Manual)

### 1. Imágenes OpenGraph
Crear las siguientes imágenes (1200x630px recomendado):

```
public/images/og-image.jpg          # Imagen OG principal (usada globalmente)
public/images/icons/icon-72x72.png
public/images/icons/icon-96x96.png
public/images/icons/icon-128x128.png
public/images/icons/icon-144x144.png
public/images/icons/icon-152x152.png  # Apple touch icon
public/images/icons/icon-192x192.png
public/images/icons/icon-384x384.png
public/images/icons/icon-512x512.png
```

**Sugerencias para og-image.jpg:**
- Usar colores corporativos: `#002e46` (primary) y `#fc9f01` (secondary)
- Incluir logo de DIAPSA
- Texto: "Grupo DIAPSA - Mantenimiento Predictivo Industrial"
- Dimensiones: 1200x630px

### 2. Google Search Console

Una vez tengas acceso a Google Search Console:

1. Verificar propiedad del dominio `grupodiapsa.com`
2. Obtener el código de verificación HTML meta tag
3. Descomentar y reemplazar en `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  // ... otras propiedades
  verification: {
    google: "tu-codigo-de-google-search-console",
  },
};
```

4. Enviar sitemap: `https://grupodiapsa.com/sitemap.xml`

### 3. URL Base de Producción

Cuando tengas el dominio definitivo, actualizar `BASE_URL` en:
- `app/layout.tsx` (línea ~22)
- `app/sitemap.ts` (línea ~4)
- `app/robots.ts` (línea ~3)
- `components/atoms/JsonLd.tsx` (buscar `https://grupodiapsa.com`)

---

## 🔍 Verificación SEO

### Herramientas Recomendadas

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Verificar datos estructurados JSON-LD

2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - Verificar OpenGraph tags

3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Verificar Twitter Cards

4. **Lighthouse**: DevTools > Lighthouse > SEO
   - Auditoría completa de SEO

### URLs del Sitemap

El sitemap incluye automáticamente:
- Páginas estáticas principales
- 5 páginas de servicios
- 14+ páginas de productos (cámaras)
- 3 páginas de blog (cuando se implemente)

---

## 📊 Mejoras Futuras Sugeridas

1. **Blog dinámico**: Implementar rutas `/blog/[slug]` con JSON-LD de Article
2. **FAQ Schema**: Añadir schema FAQ en secciones de preguntas frecuentes
3. **Course Schema**: Expandir con fechas, precios cuando estén disponibles
4. **Local SEO**: Añadir ubicación física específica cuando sea público
5. **Hreflang**: Si se planea versión en inglés, implementar alternates
