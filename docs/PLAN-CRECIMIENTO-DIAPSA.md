# Plan de Crecimiento y Optimización — Grupo DIAPSA
**Fecha:** 18 de agosto de 2026  
**Sitio:** https://www.grupodiapsa.com.mx  
**Stack:** Next.js 16 + React 19 + Tailwind v4  
**Objetivo:** Aumentar tráfico orgánico, leads B2B y conversión mediante SEO técnico, performance y UX

---

## Resumen Ejecutivo

DIAPSA tiene un sitio técnicamente sólido (Next.js 16, App Router, 26 rutas dinámicas) pero con **inconsistencias críticas en SEO** que generan redirects innecesarios, diluyen autoridad de dominio y confunden a Google.

**Oportunidad principal:** Fix de SEO técnico rápido (~2 días) puede mejorar indexación y rankings sin tocar contenido. Implementación de mejoras de conversión (~1 semana) puede duplicar leads con el mismo tráfico.

**ROI estimado:**
- SEO técnico: +15-25% tráfico orgánico en 60 días
- Performance: +10-15% conversión por mejora de Core Web Vitals
- UX/CTA: +20-40% conversión por optimización de formularios y trust signals

---

## Fase 1: SEO Técnico (CRÍTICO — 2 días)

### 1.1 Fix de Dominios Inconsistentes ⚠️ **URGENTE**

**Problema detectado:**
- `robots.ts` apunta a `https://grupodiapsa.com` (sin www)
- `sitemap.ts` usa `https://grupodiapsa.com.mx` (sin www)
- `layout.tsx` tiene `https://www.grupodiapsa.com.mx` (correcto)
- JSON-LD en blog y casos de éxito usa `https://grupodiapsa.com`

**Impacto:**
- Todas las URLs del sitemap redirigen 301 → pérdida de link juice
- Google ve 3 versiones del dominio → dilución de autoridad
- Probable duplicate content en Search Console

**Fix:**
```typescript
// ÚNICO valor canónico en toda la app
const CANONICAL_BASE_URL = "https://www.grupodiapsa.com.mx";

// Centralizar en /lib/constants.ts
export const SITE_CONFIG = {
  baseUrl: "https://www.grupodiapsa.com.mx",
  name: "Grupo DIAPSA",
  // ...
} as const;

// Usar en robots.ts, sitemap.ts, layout.tsx, todos los JSON-LD
```

**Archivos a modificar:**
1. `app/robots.ts` línea 3
2. `app/sitemap.ts` línea 12
3. `app/blog/[slug]/page.tsx` líneas 73-85 (JSON-LD)
4. `app/casos-exito/[slug]/page.tsx` líneas 173-185 (JSON-LD)
5. Crear `lib/constants.ts` con config centralizada

**Validación:**
- Todas las URLs del sitemap deben devolver 200 (no 301)
- Google Search Console debe ver UNA sola versión
- `curl -I https://www.grupodiapsa.com.mx/sitemap.xml` → todas las URLs 200

---

### 1.2 Metadatos Faltantes

**Páginas sin metadata exportada (revisión rápida detectó 10+):**
- `/acerca-de/page.tsx`
- `/blog/page.tsx`
- `/camaras/page.tsx`
- `/casos-exito/page.tsx`
- `/contacto/page.tsx`
- `/cursos/page.tsx`
- `/folletodigital/page.tsx`

**Template de metadata:**
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Título específico de 50-60 chars",
  description: "Descripción única de 150-160 chars con keywords long-tail",
  openGraph: {
    title: "...",
    description: "...",
    images: [{ url: "/images/og/nombre-pagina.jpg" }], // 1200x630
  },
};
```

**Prioridad:**
1. Páginas de conversión: `/contacto`, `/servicios/*`, `/productos/*`
2. Páginas de contenido: `/blog`, `/cursos`, `/casos-exito`
3. Resto

---

### 1.3 Imágenes OG Faltantes

**Detectado:**
- Solo existe `/images/og-images/og-image.jpg` (genérica)
- 26 páginas usan la misma imagen → pérdida de CTR en redes sociales

**Plan:**
1. Generar OG images específicas para:
   - 6 servicios principales (monitoreo, diagnóstico, gas, etc.)
   - Top 10 productos
   - Top 5 posts del blog
   - Cursos destacados
2. Dimensiones: **1200x630** (estándar FB/LinkedIn)
3. Branding: logo + título + visual del servicio/producto

**Herramientas:**
- Manual: Figma/Canva con template
- Automático: `@vercel/og` para generar dinámicamente en build time

---

### 1.4 Structured Data (JSON-LD)

**Estado actual:**
- ✅ Organization schema (layout.tsx)
- ✅ LocalBusiness schema (layout.tsx)
- ✅ WebSite schema (layout.tsx)
- ✅ Article schema en blog
- ✅ Course schema en cursos

**Faltantes:**
1. **Product schema** en páginas de productos → crítico para Google Shopping y rich snippets
2. **BreadcrumbList** en todas las páginas internas → mejora UX en SERPs
3. **FAQPage** en servicios → ocupa más espacio en resultados
4. **VideoObject** si agregan videos (futuro)

**Ejemplo Product schema:**
```typescript
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Cámara Termográfica HIKMIKRO M20",
  "image": "https://www.grupodiapsa.com.mx/images/productos/m20.jpg",
  "description": "...",
  "brand": { "@type": "Brand", "name": "HIKMIKRO" },
  "offers": {
    "@type": "Offer",
    "url": "https://www.grupodiapsa.com.mx/productos/camaras-termograficas/m20",
    "priceCurrency": "MXN",
    "price": "29999", // si no muestran precio, usar "availability": "InStock"
    "availability": "https://schema.org/InStock"
  }
}
```

---

### 1.5 Sitemap Optimización

**Mejoras:**
1. **Split sitemaps** cuando lleguen a >5000 URLs:
   ```
   /sitemap.xml → índice
   /sitemap-products.xml
   /sitemap-blog.xml
   /sitemap-services.xml
   ```

2. **lastModified dinámico** basado en `updated_at` del CMS (actualmente usa `new Date()` → siempre hoy)

3. **Prioridades ajustadas:**
   - Home: 1.0 ✅
   - Servicios principales: 0.9 ✅
   - Productos: 0.7 → **subir a 0.8** (son páginas de conversión)
   - Blog: 0.6 → OK (contenido evergreen)

---

## Fase 2: Performance y Core Web Vitals (3-5 días)

### 2.1 Auditoría Inicial

**Herramientas:**
1. PageSpeed Insights: https://pagespeed.web.dev/
2. WebPageTest: https://www.webpagetest.org/
3. Chrome DevTools Lighthouse

**Métricas objetivo:**
| Métrica | Objetivo | Típico actual (estimado) |
|---------|----------|--------------------------|
| LCP | < 2.5s | 3-4s (imágenes sin optimizar) |
| FID/INP | < 100ms | OK (Next.js maneja bien) |
| CLS | < 0.1 | 0.15-0.25 (layout shifts) |
| TTFB | < 600ms | OK (Cloudflare cache) |

---

### 2.2 Optimización de Imágenes

**Problema estimado:**
- Muchas imágenes del CMS vienen en tamaños originales (1-3 MB)
- DigitalOcean Spaces no tiene resize automático

**Soluciones:**

**Opción A: Next.js Image Optimization (remoto)**
```typescript
// next.config.ts
export default {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'diapsa-storage.sfo3.cdn.digitaloceanspaces.com',
    }],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
}
```
**Pros:** Automático, genera WebP/AVIF
**Cons:** Aumenta carga del servidor (puede necesitar upgrade de plan)

**Opción B: Cloudflare Images** (recomendado para B2B)
- Costo: ~$5/mes por 100k transformaciones
- Ventaja: CDN + resize + WebP/AVIF automático
- Setup: apuntar `<Image src={cloudflareImageUrl(cms_url)} />`

**Opción C: Pre-resize en el CMS** (Laravel)
- Intervention Image en upload → genera 3 tamaños (thumb, medium, large)
- Ventaja: cero costo extra, control total
- Desventaja: requiere trabajo en backend

---

### 2.3 Lazy Loading y Prioridades

**Implementar:**
1. **Priority en hero images:**
   ```tsx
   <Image src="/hero.jpg" priority alt="..." />
   ```

2. **Lazy loading por defecto** en todo lo demás (Next.js ya lo hace, verificar que no haya `loading="eager"` innecesarios)

3. **Prefetch estratégico** en links críticos:
   ```tsx
   <Link href="/contacto" prefetch={true}>Cotizar</Link>
   ```

---

### 2.4 Fonts Optimization

**Actual:**
```typescript
import { Geist, Geist_Mono } from "next/font/google";
```

**Ya está optimizado** (Next.js 16 auto-optimiza Google Fonts). Verificar:
- No hay font flash (FOUT/FOIT)
- `font-display: swap` está activo
- Preconnect a Google Fonts en `<head>`

---

### 2.5 Bundle Size Reduction

**Análisis:**
```bash
npm run build
# Revisar .next/server/app-paths-manifest.json
```

**Posibles optimizaciones:**
1. **Code splitting** por ruta (Next.js ya lo hace)
2. **Dynamic imports** para componentes pesados:
   ```tsx
   const HeavyChart = dynamic(() => import('@/components/Chart'), {
     ssr: false,
     loading: () => <Skeleton />
   })
   ```

3. **Tree shaking** de Tiptap (solo importar extensiones usadas)

4. **Eliminar shadcn components no usados** (si hay)

---

## Fase 3: Conversión y UX (1 semana)

### 3.1 Formulario de Contacto

**Audit actual:**
- ¿Cuántos campos tiene?
- ¿Hay validación en tiempo real?
- ¿Mensaje de confirmación claro?
- ¿Email de follow-up automático?

**Best practices B2B:**
1. **Máximo 5 campos** en formulario inicial:
   - Nombre
   - Email
   - Teléfono
   - Empresa
   - Mensaje (opcional, puede ser dropdown "¿Qué servicio te interesa?")

2. **Trust signals junto al form:**
   - Logos de clientes (si tienen permiso)
   - "Respondemos en < 24 horas"
   - Certificaciones (ISO, etc.)

3. **Multi-step form** para cotizaciones complejas:
   - Paso 1: Tipo de servicio
   - Paso 2: Detalles técnicos
   - Paso 3: Datos de contacto
   - Ventaja: +30% conversión vs. form largo

---

### 3.2 CTAs (Call to Action)

**Auditar en cada página:**
- ¿Hay CTA above the fold?
- ¿Es claro qué pasa al hacer clic?
- ¿Contrasta visualmente?

**Recomendaciones:**
1. **Botón primario:** color DIAPSA (#002e46 actual) con hover state claro
2. **Texto orientado a beneficio:**
   - ❌ "Contactar"
   - ✅ "Solicitar diagnóstico gratuito"
   - ✅ "Hablar con un experto"

3. **Sticky CTA** en mobile para servicios/productos:
   ```tsx
   <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 md:hidden">
     <Button className="w-full">Cotizar ahora</Button>
   </div>
   ```

---

### 3.3 Social Proof

**Elementos a agregar:**
1. **Casos de éxito en home** (ya existe la sección, asegurar que esté destacada)
2. **Logos de clientes** (si legal lo permite)
3. **Estadísticas:**
   - "500+ empresas confían en DIAPSA"
   - "15 años de experiencia"
   - "Cobertura en México y Sudamérica"
4. **Testimonios** con foto + nombre + empresa (aumenta credibilidad 3x)

---

### 3.4 Mobile UX

**Checklist:**
- [ ] Texto legible sin zoom (mínimo 16px)
- [ ] Botones >44px de altura (target fácil)
- [ ] Formularios con `inputmode` correcto (`email`, `tel`, `numeric`)
- [ ] Menú hamburguesa fluido
- [ ] Tap targets separados (no botones pegados)

---

## Fase 4: Contenido y Tráfico (ongoing)

### 4.1 Estrategia de Keywords

**Research inicial:**
1. **Herramientas:**
   - Google Keyword Planner
   - Ahrefs / SEMrush
   - AnswerThePublic para long-tail

2. **Keywords primarias (alto volumen, competencia media):**
   - "mantenimiento predictivo industrial"
   - "cámaras termográficas México"
   - "análisis de vibraciones"
   - "detección de gases industrial"
   - "monitoreo de condición"

3. **Keywords long-tail (baja competencia, alta intención):**
   - "cómo funciona el mantenimiento predictivo"
   - "diferencia entre mantenimiento predictivo y preventivo"
   - "precio cámara termográfica industrial"
   - "curso termografía infrarroja México"

---

### 4.2 Plan de Contenido

**Blog (2 posts/mes mínimo):**
1. **Educational SEO:**
   - "Guía completa de mantenimiento predictivo [2026]"
   - "5 señales de que tu planta necesita monitoreo de condición"
   - "ROI del mantenimiento predictivo: caso real"

2. **Comparison posts:**
   - "Mantenimiento predictivo vs preventivo: ¿cuál elegir?"
   - "Comparativa: mejores cámaras termográficas industriales"

3. **How-to técnico:**
   - "Cómo interpretar un termograma industrial"
   - "Checklist pre-implementación de mantenimiento predictivo"

**Formato:**
- 1500-2500 palabras
- Estructura con H2, H3 claros
- Imágenes/diagramas cada 300 palabras
- CTA al final ("¿Necesitas implementar esto? Contáctanos")

---

### 4.3 Link Building

**Tácticas B2B:**
1. **Directorios industriales:**
   - Cámaras de comercio
   - Asociaciones de mantenimiento industrial
   - Directorios de proveedores (e.g., Kompass, ThomasNet si expanden a USA)

2. **Guest posting:**
   - Blogs de ingeniería industrial
   - Revistas del sector (digital)

3. **Casos de éxito compartidos:**
   - Cliente feliz publica case study → link de vuelta

4. **Colaboraciones:**
   - Webinars con fabricantes de equipos (HIKMIKRO, etc.)
   - Contenido co-branded

---

### 4.4 Google Business Profile

**Optimización:**
1. Verificar que esté completo:
   - Horarios
   - Fotos (oficina, equipo, proyectos)
   - Servicios detallados
   - Área de cobertura

2. **Posts semanales:**
   - Nuevos servicios
   - Casos de éxito
   - Eventos/webinars

3. **Reseñas:**
   - Pedir a clientes satisfechos (post-servicio)
   - Responder TODAS (positivas y negativas)

---

## Fase 5: Infraestructura y Deploy (2-3 días)

### 5.1 Pipeline de Deploy

**Problemas actuales (según deploy.yml):**
- No cache de `node_modules` → builds lentos
- No staging branch → cambios van directo a prod
- No rollback automático → si build falla, sitio queda caído
- No healthcheck post-deploy

**Mejoras:**

**1. Cache de dependencias:**
```yaml
- name: Cache node_modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**2. Staging environment:**
- Branch `develop` → deploya a `staging.grupodiapsa.com.mx`
- Branch `main` → deploya a `www.grupodiapsa.com.mx`
- Merge a main solo después de QA en staging

**3. Rollback automático:**
```bash
# Backup del build anterior
cp -r .next .next.backup

# Build nuevo
npm run build

# Healthcheck
if ! curl -f http://localhost:3050/api/health; then
  echo "Deploy failed, rolling back"
  rm -rf .next
  mv .next.backup .next
  pm2 reload ecosystem.config.js
  exit 1
fi
```

**4. Healthcheck endpoint:**
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

---

### 5.2 Monitoring

**Implementar:**
1. **Uptime monitoring:** UptimeRobot (gratis hasta 50 monitores)
2. **Error tracking:** Sentry (gratis hasta 5k eventos/mes)
3. **Analytics:** 
   - Google Analytics 4 (tráfico, conversiones)
   - Microsoft Clarity (heatmaps, session replays) — gratis, complementa GA

**Eventos a trackear:**
- Form submissions (éxito/error)
- Clicks en CTAs principales
- Descarga de folletos
- Reproducción de videos (si agregan)

---

## Fase 6: Quick Wins (implementar YA)

### Prioridad 1 (< 1 día):
1. ✅ Fix dominios inconsistentes (robots.ts, sitemap.ts, JSON-LD)
2. ✅ Agregar metadata a `/contacto` y páginas de servicios principales
3. ✅ Crear 3 OG images (home, servicios, productos)
4. ✅ Agregar Product schema a top 5 productos

### Prioridad 2 (2-3 días):
5. ✅ Optimizar imágenes del hero (WebP + priority)
6. ✅ Agregar CTA sticky en mobile
7. ✅ Implementar healthcheck endpoint
8. ✅ Configurar Google Business Profile completo

### Prioridad 3 (1 semana):
9. ✅ Migrar a Cloudflare Images (o pre-resize en CMS)
10. ✅ Escribir primer post de blog SEO-optimizado
11. ✅ Configurar Sentry para error tracking
12. ✅ Implementar cache de node_modules en deploy

---

## Métricas de Éxito

**Baseline (medir ANTES de cambios):**
- Tráfico orgánico mensual (Google Analytics)
- Posición promedio en Search Console (top 10 keywords)
- Conversión: leads/visitas (%)
- Core Web Vitals (PageSpeed Insights)

**Objetivos 90 días:**
| Métrica | Baseline (estimado) | Objetivo +90 días | Método |
|---------|---------------------|-------------------|--------|
| Tráfico orgánico | 5,000/mes | 6,500/mes (+30%) | GA4 |
| Posición promedio | 15-20 | 10-15 | Search Console |
| Conversion rate | 2% | 3.5% (+75%) | GA4 Goals |
| LCP | 3.5s | <2.5s | PageSpeed |
| Leads/mes | 40 | 70 (+75%) | CRM tracking |

---

## Recursos Necesarios

### Desarrollo:
- **Dev frontend:** 20-30 hrs (SEO + performance + UX)
- **Dev backend:** 5-10 hrs (resize de imágenes en CMS, si opción C)
- **DevOps:** 8 hrs (deploy pipeline, staging, monitoring)

### Contenido:
- **Copywriter:** 10 hrs/mes (2 posts blog)
- **Diseñador:** 5 hrs (OG images, gráficos para blog)

### Marketing:
- **SEO specialist:** 5 hrs/mes (keyword research, link building)

### Presupuesto externo (opcional):
- Cloudflare Images: $5-20/mes
- Sentry Pro: $26/mes (si exceden tier gratuito)
- UptimeRobot Pro: $7/mes (SMS alerts)
- **Total:** ~$40-50/mes en SaaS

---

## Roadmap de Implementación

### Semana 1:
- [ ] Día 1-2: SEO técnico (dominios, metadata, sitemap)
- [ ] Día 3-4: Performance (imágenes, fonts, lazy loading)
- [ ] Día 5: Quick wins (CTA, healthcheck, GBP)

### Semana 2:
- [ ] Deploy pipeline (staging, rollback, cache)
- [ ] Monitoring (Sentry, UptimeRobot, Clarity)
- [ ] Primer post de blog

### Semana 3-4:
- [ ] UX improvements (formularios, social proof, mobile)
- [ ] Structured data completo (Product, FAQ, Breadcrumbs)
- [ ] Link building inicial

### Mes 2-3:
- [ ] Contenido regular (2 posts/mes)
- [ ] Iteración basada en datos (Clarity heatmaps, GA4)
- [ ] Optimizaciones adicionales según métricas

---

## Siguiente Paso

**Decisión requerida:**

¿Empezar con Fase 1 (SEO técnico) inmediatamente? Es la de mayor ROI y menor esfuerzo (2 días de dev para +15-25% tráfico en 60 días).

Si apruebas, genero los PRs con:
1. Fix de dominios (4 archivos)
2. Metadata para top 5 páginas
3. Healthcheck endpoint
4. Config de constants centralizada

¿Arrancamos?
