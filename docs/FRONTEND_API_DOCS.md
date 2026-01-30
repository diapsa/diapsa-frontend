# API Documentation - Frontend Team

> Documentación para consumir la API pública de Grupo Diapsa desde aplicaciones frontend.

## 📋 Índice

- [Información General](#información-general)
- [API de Productos](#api-de-productos)
- [API de Categorías](#api-de-categorías)
- [API de Marcas](#api-de-marcas)
- [API de Series](#api-de-series)
- [API de Contactos](#api-de-contactos)
- [Manejo de Errores](#manejo-de-errores)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## Información General

### Base URL

```
http://cms.grupodiapsa.com.mx/api/v1
```

### Formato de Respuesta

Todas las respuestas de la API están en formato JSON y siguen el estándar de Laravel API Resources.

### Autenticación

Las rutas de esta API son **públicas** y no requieren autenticación.

### Rate Limiting

- **Productos**: Sin límite
- **Contactos**: 5 requests por minuto por IP

---

## API de Productos

### 1. Listar Productos

Lista todos los productos activos con paginación.

**Endpoint:**
```
GET /api/v1/products
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `category` | string | No | Filtrar por slug de categoría |
| `brand` | string | No | Filtrar por slug de marca |
| `series` | string | No | Filtrar por slug de serie |
| `per_page` | integer | No | Resultados por página (default: 15) |
| `page` | integer | No | Número de página (default: 1) |

**Ejemplo de Request:**
```bash
GET /api/v1/products?category=compresores&brand=atlas-copco&per_page=20&page=1
```

**Ejemplo de Response:**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "compresor-ga-30",
      "model": "GA 30",
      "name": "Compresor GA 30 Atlas Copco",
      "short_description": "Compresor de tornillo rotativo de 30 HP",
      "availability_status": "Disponible",
      "featured": true,
      "is_new": false,
      "main_image": "https://cms.grupodiapsa.com.mx/storage/products/ga-30-main.jpg",
      "category": {
        "id": 5,
        "slug": "compresores",
        "name": "Compresores"
      },
      "brand": {
        "id": 2,
        "slug": "atlas-copco",
        "name": "Atlas Copco"
      },
      "featured_specs": [
        {
          "label": "Potencia",
          "value": "30",
          "unit": "HP"
        },
        {
          "label": "Presión máxima",
          "value": "145",
          "unit": "PSI"
        }
      ]
    }
  ],
  "links": {
    "first": "http://cms.grupodiapsa.com.mx/api/v1/products?page=1",
    "last": "http://cms.grupodiapsa.com.mx/api/v1/products?page=5",
    "prev": null,
    "next": "http://cms.grupodiapsa.com.mx/api/v1/products?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 15,
    "to": 15,
    "total": 73
  }
}
```

### 2. Detalle de Producto

Obtiene información completa de un producto específico.

**Endpoint:**
```
GET /api/v1/products/{slug}
```

**Parámetros de URL:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `slug` | string | Slug único del producto |

**Ejemplo de Request:**
```bash
GET /api/v1/products/compresor-ga-30
```

**Ejemplo de Response:**
```json
{
  "data": {
    "id": 1,
    "slug": "compresor-ga-30",
    "model": "GA 30",
    "name": "Compresor GA 30 Atlas Copco",
    "short_description": "Compresor de tornillo rotativo de 30 HP",
    "description": "El compresor GA 30 es una solución eficiente...",
    "availability_status": "Disponible",
    "featured": true,
    "is_new": false,
    "category": {
      "id": 5,
      "slug": "compresores",
      "name": "Compresores"
    },
    "subcategory": {
      "id": 12,
      "slug": "compresores-tornillo",
      "name": "Compresores de Tornillo"
    },
    "brand": {
      "id": 2,
      "slug": "atlas-copco",
      "name": "Atlas Copco",
      "logo": "https://cms.grupodiapsa.com.mx/storage/brands/atlas-copco.png"
    },
    "series": {
      "id": 8,
      "slug": "ga-series",
      "name": "GA Series"
    },
    "images": [
      {
        "id": 1,
        "url": "https://cms.grupodiapsa.com.mx/storage/products/ga-30-1.jpg",
        "alt": "Compresor GA 30 - Vista frontal",
        "type": "main"
      },
      {
        "id": 2,
        "url": "https://cms.grupodiapsa.com.mx/storage/products/ga-30-2.jpg",
        "alt": "Compresor GA 30 - Vista lateral",
        "type": "gallery"
      }
    ],
    "specifications": [
      {
        "group": "Características Técnicas",
        "items": [
          {
            "label": "Potencia",
            "value": "30",
            "unit": "HP",
            "featured": true
          },
          {
            "label": "Presión máxima",
            "value": "145",
            "unit": "PSI",
            "featured": true
          },
          {
            "label": "Capacidad",
            "value": "120",
            "unit": "CFM",
            "featured": false
          }
        ]
      },
      {
        "group": "Dimensiones",
        "items": [
          {
            "label": "Largo",
            "value": "1800",
            "unit": "mm",
            "featured": false
          },
          {
            "label": "Ancho",
            "value": "900",
            "unit": "mm",
            "featured": false
          }
        ]
      }
    ],
    "documents": [
      {
        "id": 1,
        "type": "manual",
        "name": "Manual de Usuario GA 30",
        "url": "https://cms.grupodiapsa.com.mx/storage/documents/ga-30-manual.pdf",
        "language": "es"
      },
      {
        "id": 2,
        "type": "datasheet",
        "name": "Ficha Técnica GA 30",
        "url": "https://cms.grupodiapsa.com.mx/storage/documents/ga-30-datasheet.pdf",
        "language": "es"
      }
    ],
    "related_products": [
      {
        "id": 2,
        "slug": "compresor-ga-37",
        "model": "GA 37",
        "name": "Compresor GA 37 Atlas Copco",
        "short_description": "Compresor de tornillo rotativo de 37 HP",
        "main_image": "https://cms.grupodiapsa.com.mx/storage/products/ga-37.jpg",
        "brand": {
          "id": 2,
          "slug": "atlas-copco",
          "name": "Atlas Copco"
        }
      }
    ],
    "seo": {
      "title": "Compresor GA 30 Atlas Copco - Grupo Diapsa",
      "description": "Compresor de tornillo rotativo GA 30 de Atlas Copco. Eficiencia energética y confiabilidad para tu industria."
    }
  }
}
```

### 3. Buscar Productos

Busca productos por nombre, modelo o descripción.

**Endpoint:**
```
GET /api/v1/products/search
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `q` | string | Sí | Término de búsqueda (mín: 2, máx: 100 caracteres) |
| `per_page` | integer | No | Resultados por página (default: 15) |
| `page` | integer | No | Número de página (default: 1) |

**Ejemplo de Request:**
```bash
GET /api/v1/products/search?q=compresor%20atlas
```

**Response:** Mismo formato que "Listar Productos"

### 4. Productos Destacados

Obtiene hasta 12 productos marcados como destacados.

**Endpoint:**
```
GET /api/v1/products/featured
```

**Parámetros:** Ninguno

**Ejemplo de Request:**
```bash
GET /api/v1/products/featured
```

**Response:** Mismo formato que "Listar Productos" pero sin paginación

---

## API de Categorías

### 1. Listar Categorías

Lista todas las categorías raíz activas con sus subcategorías (estructura jerárquica).

**Endpoint:**
```
GET /api/v1/categories
```

**Parámetros:** Ninguno

**Ejemplo de Request:**
```bash
GET /api/v1/categories
```

**Ejemplo de Response:**
```json
{
  "data": [
    {
      "id": 5,
      "slug": "compresores",
      "name": "Compresores",
      "description": "Soluciones completas en aire comprimido",
      "icon": "compressor-icon.svg",
      "image": "https://cms.grupodiapsa.com.mx/storage/categories/compresores.jpg",
      "level": 0,
      "products_count": 45,
      "children": [
        {
          "id": 12,
          "slug": "compresores-tornillo",
          "name": "Compresores de Tornillo",
          "description": "Compresores de tornillo rotativo",
          "icon": null,
          "image": null,
          "level": 1,
          "products_count": 23
        },
        {
          "id": 13,
          "slug": "compresores-piston",
          "name": "Compresores de Pistón",
          "description": "Compresores alternativos de pistón",
          "icon": null,
          "image": null,
          "level": 1,
          "products_count": 15
        }
      ],
      "seo": {
        "title": "Compresores de Aire - Grupo Diapsa",
        "description": "Encuentra la mejor solución en compresores de aire para tu industria"
      }
    },
    {
      "id": 8,
      "slug": "generadores",
      "name": "Generadores",
      "description": "Energía confiable cuando más la necesitas",
      "icon": "generator-icon.svg",
      "image": "https://cms.grupodiapsa.com.mx/storage/categories/generadores.jpg",
      "level": 0,
      "products_count": 28,
      "children": [],
      "seo": {
        "title": "Generadores de Energía - Grupo Diapsa",
        "description": "Generadores industriales y residenciales de alta calidad"
      }
    }
  ]
}
```

### 2. Detalle de Categoría

Obtiene información completa de una categoría específica, incluyendo su padre (si existe) y sus subcategorías.

**Endpoint:**
```
GET /api/v1/categories/{slug}
```

**Parámetros de URL:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `slug` | string | Slug único de la categoría |

**Ejemplo de Request:**
```bash
GET /api/v1/categories/compresores
```

**Ejemplo de Response:**
```json
{
  "data": {
    "id": 5,
    "slug": "compresores",
    "name": "Compresores",
    "description": "Soluciones completas en aire comprimido para aplicaciones industriales. Ofrecemos compresores de tornillo, pistón y otros tipos para satisfacer todas tus necesidades.",
    "icon": "compressor-icon.svg",
    "image": "https://cms.grupodiapsa.com.mx/storage/categories/compresores.jpg",
    "level": 0,
    "parent": null,
    "products_count": 45,
    "children": [
      {
        "id": 12,
        "slug": "compresores-tornillo",
        "name": "Compresores de Tornillo",
        "description": "Compresores de tornillo rotativo para alta eficiencia",
        "icon": null,
        "image": null,
        "level": 1,
        "products_count": 23
      },
      {
        "id": 13,
        "slug": "compresores-piston",
        "name": "Compresores de Pistón",
        "description": "Compresores alternativos de pistón",
        "icon": null,
        "image": null,
        "level": 1,
        "products_count": 15
      },
      {
        "id": 14,
        "slug": "compresores-libres-aceite",
        "name": "Compresores Libres de Aceite",
        "description": "Aire 100% libre de aceite para industrias críticas",
        "icon": null,
        "image": null,
        "level": 1,
        "products_count": 7
      }
    ],
    "seo": {
      "title": "Compresores de Aire Industriales - Grupo Diapsa",
      "description": "Encuentra la mejor solución en compresores de aire para tu industria. Tornillo, pistón y libres de aceite."
    }
  }
}
```

**Ejemplo de Response (Subcategoría con Padre):**
```json
{
  "data": {
    "id": 12,
    "slug": "compresores-tornillo",
    "name": "Compresores de Tornillo",
    "description": "Compresores de tornillo rotativo de alta eficiencia energética",
    "icon": null,
    "image": "https://cms.grupodiapsa.com.mx/storage/categories/compresores-tornillo.jpg",
    "level": 1,
    "parent": {
      "id": 5,
      "slug": "compresores",
      "name": "Compresores"
    },
    "products_count": 23,
    "children": [],
    "seo": {
      "title": "Compresores de Tornillo Rotativo - Grupo Diapsa",
      "description": "Compresores de tornillo de las mejores marcas. Eficiencia energética y confiabilidad garantizada."
    }
  }
}
```

---

## API de Marcas

### 1. Listar Marcas

Lista todas las marcas activas ordenadas por orden de visualización.

**Endpoint:**
```
GET /api/v1/brands
```

**Parámetros:** Ninguno

**Ejemplo de Request:**
```bash
GET /api/v1/brands
```

**Ejemplo de Response:**
```json
{
  "data": [
    {
      "id": 2,
      "slug": "atlas-copco",
      "name": "Atlas Copco",
      "logo": "https://cms.grupodiapsa.com.mx/storage/brands/atlas-copco.png",
      "website": "https://www.atlascopco.com",
      "products_count": 67
    },
    {
      "id": 5,
      "slug": "sullair",
      "name": "Sullair",
      "logo": "https://cms.grupodiapsa.com.mx/storage/brands/sullair.png",
      "website": "https://www.sullair.com",
      "products_count": 34
    },
    {
      "id": 8,
      "slug": "kohler",
      "name": "Kohler",
      "logo": "https://cms.grupodiapsa.com.mx/storage/brands/kohler.png",
      "website": "https://www.kohlerpower.com",
      "products_count": 28
    }
  ]
}
```

### 2. Detalle de Marca

Obtiene información completa de una marca específica, incluyendo sus series activas.

**Endpoint:**
```
GET /api/v1/brands/{slug}
```

**Parámetros de URL:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `slug` | string | Slug único de la marca |

**Ejemplo de Request:**
```bash
GET /api/v1/brands/atlas-copco
```

**Ejemplo de Response:**
```json
{
  "data": {
    "id": 2,
    "slug": "atlas-copco",
    "name": "Atlas Copco",
    "logo": "https://cms.grupodiapsa.com.mx/storage/brands/atlas-copco.png",
    "website": "https://www.atlascopco.com",
    "products_count": 67,
    "series": [
      {
        "id": 8,
        "slug": "ga-series",
        "name": "GA Series",
        "description": "Compresores de tornillo rotativo de velocidad fija",
        "image": "https://cms.grupodiapsa.com.mx/storage/series/ga-series.jpg",
        "brand": {
          "id": 2,
          "slug": "atlas-copco",
          "name": "Atlas Copco"
        },
        "category": {
          "id": 12,
          "slug": "compresores-tornillo",
          "name": "Compresores de Tornillo"
        },
        "products_count": 15
      },
      {
        "id": 9,
        "slug": "vsd-plus-series",
        "name": "VSD⁺ Series",
        "description": "Compresores de velocidad variable con tecnología VSD⁺",
        "image": "https://cms.grupodiapsa.com.mx/storage/series/vsd-plus.jpg",
        "brand": {
          "id": 2,
          "slug": "atlas-copco",
          "name": "Atlas Copco"
        },
        "category": {
          "id": 12,
          "slug": "compresores-tornillo",
          "name": "Compresores de Tornillo"
        },
        "products_count": 12
      }
    ]
  }
}
```

---

## API de Series

### 1. Listar Series

Lista todas las series activas con sus marcas y categorías asociadas.

**Endpoint:**
```
GET /api/v1/series
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `brand` | string | No | Filtrar por slug de marca |
| `category` | string | No | Filtrar por slug de categoría |

**Ejemplo de Request (Sin Filtros):**
```bash
GET /api/v1/series
```

**Ejemplo de Request (Con Filtros):**
```bash
GET /api/v1/series?brand=atlas-copco&category=compresores-tornillo
```

**Ejemplo de Response:**
```json
{
  "data": [
    {
      "id": 8,
      "slug": "ga-series",
      "name": "GA Series",
      "description": "Compresores de tornillo rotativo de velocidad fija para aplicaciones industriales",
      "image": "https://cms.grupodiapsa.com.mx/storage/series/ga-series.jpg",
      "brand": {
        "id": 2,
        "slug": "atlas-copco",
        "name": "Atlas Copco"
      },
      "category": {
        "id": 12,
        "slug": "compresores-tornillo",
        "name": "Compresores de Tornillo"
      },
      "products_count": 15
    },
    {
      "id": 9,
      "slug": "vsd-plus-series",
      "name": "VSD⁺ Series",
      "description": "Compresores de velocidad variable con tecnología VSD⁺ para máximo ahorro energético",
      "image": "https://cms.grupodiapsa.com.mx/storage/series/vsd-plus.jpg",
      "brand": {
        "id": 2,
        "slug": "atlas-copco",
        "name": "Atlas Copco"
      },
      "category": {
        "id": 12,
        "slug": "compresores-tornillo",
        "name": "Compresores de Tornillo"
      },
      "products_count": 12
    }
  ]
}
```

### 2. Detalle de Serie

Obtiene información completa de una serie específica.

**Endpoint:**
```
GET /api/v1/series/{slug}
```

**Parámetros de URL:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `slug` | string | Slug único de la serie |

**Ejemplo de Request:**
```bash
GET /api/v1/series/ga-series
```

**Ejemplo de Response:**
```json
{
  "data": {
    "id": 8,
    "slug": "ga-series",
    "name": "GA Series",
    "description": "Los compresores GA Series son compresores de tornillo rotativo de velocidad fija diseñados para ofrecer confiabilidad y eficiencia en aplicaciones industriales. Con un diseño robusto y tecnología probada, son la elección ideal para operaciones continuas.",
    "image": "https://cms.grupodiapsa.com.mx/storage/series/ga-series.jpg",
    "brand": {
      "id": 2,
      "slug": "atlas-copco",
      "name": "Atlas Copco"
    },
    "category": {
      "id": 12,
      "slug": "compresores-tornillo",
      "name": "Compresores de Tornillo"
    },
    "products_count": 15
  }
}
```

---

## API de Contactos

### Crear Contacto

Crea un nuevo registro de contacto desde formularios públicos (contacto general, expo, webinar).

**Endpoint:**
```
POST /api/v1/contacts
```

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Rate Limit:** 5 requests por minuto por IP

**Body Parameters:**

| Parámetro | Tipo | Requerido | Descripción | Validación |
|-----------|------|-----------|-------------|------------|
| `name` | string | Sí | Nombre completo | Max: 255. Solo letras, espacios, guiones y puntos |
| `email` | string | Sí | Email | Max: 255. Formato RFC válido |
| `phone` | string | No | Teléfono | Max: 50. Solo números, +, -, espacios, paréntesis |
| `company` | string | No | Empresa | Max: 255 |
| `country` | string | No | País | Max: 100 |
| `form_type` | string | Sí | Tipo de formulario | Valores: `general`, `expo`, `webinar` |
| `utm_source` | string | No | UTM Source | Max: 100 |
| `utm_medium` | string | No | UTM Medium | Max: 100 |
| `utm_campaign` | string | No | UTM Campaign | Max: 255 |
| `custom_fields` | object | No | Campos personalizados | Max: 10 campos. Cada valor max: 500 caracteres |
| `website` | string | No | **Honeypot** - debe estar vacío | Si tiene valor, la request falla |

**Tipos de Formulario (form_type):**

| Valor | Descripción | Custom Fields Sugeridos |
|-------|-------------|-------------------------|
| `general` | Contacto general | Ninguno específico |
| `expo` | Registro de exposición | `booth_number`, `event_name`, `event_date` |
| `webinar` | Registro de webinar | `webinar_title`, `webinar_date`, `attendance_confirmed` |

**Ejemplo de Request (Contacto General):**
```bash
POST /api/v1/contacts
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+52 55 1234 5678",
  "company": "Industrias ABC S.A.",
  "country": "México",
  "form_type": "general",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "compresores-2025",
  "custom_fields": {
    "message": "Me interesa conocer más sobre compresores de aire",
    "preferred_contact": "email"
  },
  "website": ""
}
```

**Ejemplo de Request (Expo):**
```json
{
  "name": "María González",
  "email": "maria.gonzalez@empresa.com",
  "phone": "+52 81 9876 5432",
  "company": "Tech Solutions",
  "country": "México",
  "form_type": "expo",
  "custom_fields": {
    "booth_number": "A-123",
    "event_name": "Expo Industrial 2025",
    "event_date": "2025-03-15"
  },
  "website": ""
}
```

**Ejemplo de Request (Webinar):**
```json
{
  "name": "Carlos Ramírez",
  "email": "carlos.ramirez@correo.com",
  "phone": "+52 33 5555 1234",
  "form_type": "webinar",
  "custom_fields": {
    "webinar_title": "Eficiencia Energética en Compresores",
    "webinar_date": "2025-02-20",
    "attendance_confirmed": "yes"
  },
  "website": ""
}
```

**Ejemplo de Response (Success - 201):**
```json
{
  "data": {
    "id": 42,
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "+52 55 1234 5678",
    "company": "Industrias ABC S.A.",
    "country": "México",
    "form_type": "general",
    "status": "new",
    "custom_fields": {
      "message": "Me interesa conocer más sobre compresores de aire",
      "preferred_contact": "email"
    },
    "created_at": "2025-01-29T10:30:00.000000Z"
  }
}
```

---

## Manejo de Errores

### Códigos de Estado HTTP

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | OK | Request exitoso (GET) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos inválidos o faltantes |
| 404 | Not Found | Recurso no encontrado |
| 422 | Unprocessable Entity | Errores de validación |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |

### Formato de Error de Validación (422)

```json
{
  "message": "El correo electrónico es obligatorio. (and 1 more error)",
  "errors": {
    "email": [
      "El correo electrónico es obligatorio."
    ],
    "phone": [
      "El teléfono solo puede contener números, espacios y caracteres +, -, (), ()."
    ]
  }
}
```

### Error de Rate Limit (429)

```json
{
  "message": "Too Many Requests"
}
```

**Headers de respuesta:**
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
Retry-After: 60
```

---

## Ejemplos de Uso

### JavaScript (Fetch API)

#### Listar Productos con Filtros
```javascript
async function fetchProducts(filters = {}) {
  const params = new URLSearchParams(filters);
  
  try {
    const response = await fetch(
      `http://cms.grupodiapsa.com.mx/api/v1/products?${params}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Uso
fetchProducts({ 
  category: 'compresores', 
  brand: 'atlas-copco',
  per_page: 20 
})
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

#### Obtener Detalle de Producto
```javascript
async function fetchProductDetail(slug) {
  try {
    const response = await fetch(
      `http://cms.grupodiapsa.com.mx/api/v1/products/${slug}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Producto no encontrado');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Devolver solo el producto
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// Uso
fetchProductDetail('compresor-ga-30')
  .then(product => console.log(product))
  .catch(error => console.error(error));
```

#### Buscar Productos
```javascript
async function searchProducts(query, page = 1) {
  try {
    const response = await fetch(
      `http://cms.grupodiapsa.com.mx/api/v1/products/search?q=${encodeURIComponent(query)}&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

// Uso
searchProducts('compresor atlas')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

#### Enviar Formulario de Contacto
```javascript
async function submitContactForm(formData) {
  try {
    const response = await fetch(
      'http://cms.grupodiapsa.com.mx/api/v1/contacts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Manejar errores de validación (422)
      if (response.status === 422) {
        throw new ValidationError(data.message, data.errors);
      }
      // Manejar rate limit (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new RateLimitError(`Rate limit excedido. Reintentar en ${retryAfter} segundos.`);
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.data; // Devolver el contacto creado
  } catch (error) {
    console.error('Error submitting contact:', error);
    throw error;
  }
}

// Clases de error personalizadas
class ValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Uso
const contactData = {
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  phone: '+52 55 1234 5678',
  company: 'Industrias ABC',
  country: 'México',
  form_type: 'general',
  custom_fields: {
    message: 'Me interesa conocer más sobre sus productos'
  },
  website: '' // Honeypot - siempre vacío
};

submitContactForm(contactData)
  .then(contact => {
    console.log('Contacto creado:', contact);
    // Mostrar mensaje de éxito al usuario
  })
  .catch(error => {
    if (error instanceof ValidationError) {
      // Mostrar errores de validación en el formulario
      console.log('Errores de validación:', error.errors);
    } else if (error instanceof RateLimitError) {
      // Mostrar mensaje de rate limit
      console.log('Rate limit excedido');
    } else {
      // Error genérico
      console.log('Error al enviar formulario');
    }
  });
```

### React + TypeScript

#### Hook para Productos
```typescript
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  slug: string;
  model: string;
  name: string;
  short_description: string;
  availability_status: string;
  featured: boolean;
  is_new: boolean;
  main_image: string | null;
  category: {
    id: number;
    slug: string;
    name: string;
  };
  brand: {
    id: number;
    slug: string;
    name: string;
  };
}

interface ProductsResponse {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

function useProducts(filters: Record<string, any> = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductsResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(filters);
        const response = await fetch(
          `http://cms.grupodiapsa.com.mx/api/v1/products?${params}`,
          {
            headers: { 'Accept': 'application/json' },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ProductsResponse = await response.json();
        setProducts(data.data);
        setMeta(data.meta);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, meta, loading, error };
}

export default useProducts;
```

#### Hook para Formulario de Contacto
```typescript
import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  form_type: 'general' | 'expo' | 'webinar';
  custom_fields?: Record<string, string>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  website?: string; // Honeypot
}

interface ValidationErrors {
  [key: string]: string[];
}

function useContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);

  const submitContact = async (formData: ContactFormData) => {
    setLoading(true);
    setSuccess(false);
    setErrors({});
    setRateLimitExceeded(false);

    try {
      const response = await fetch('http://cms.grupodiapsa.com.mx/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          website: '', // Asegurar honeypot vacío
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          // Errores de validación
          setErrors(data.errors || {});
          return { success: false, errors: data.errors };
        }

        if (response.status === 429) {
          // Rate limit excedido
          setRateLimitExceeded(true);
          return { success: false, rateLimited: true };
        }

        throw new Error(data.message || 'Error al enviar formulario');
      }

      setSuccess(true);
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setErrors({});
    setRateLimitExceeded(false);
  };

  return {
    submitContact,
    loading,
    success,
    errors,
    rateLimitExceeded,
    resetForm,
  };
}

export default useContactForm;
```

#### Componente de Formulario de Contacto
```typescript
import React, { useState } from 'react';
import useContactForm from './useContactForm';

function ContactForm() {
  const { submitContact, loading, success, errors, rateLimitExceeded } = useContactForm();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    form_type: 'general' as const,
    custom_fields: {
      message: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await submitContact(formData);
      
      if (result.success) {
        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          country: '',
          form_type: 'general',
          custom_fields: { message: '' }
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'message') {
      setFormData(prev => ({
        ...prev,
        custom_fields: { ...prev.custom_fields, message: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (success) {
    return (
      <div className="success-message">
        ¡Gracias por contactarnos! Nos comunicaremos contigo pronto.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nombre *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <span className="error">{errors.name[0]}</span>}
      </div>

      <div>
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className="error">{errors.email[0]}</span>}
      </div>

      <div>
        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.phone[0]}</span>}
      </div>

      <div>
        <label htmlFor="company">Empresa</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          value={formData.custom_fields.message}
          onChange={handleChange}
          rows={4}
        />
      </div>

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      {rateLimitExceeded && (
        <div className="error-message">
          Has excedido el límite de envíos. Por favor, espera un minuto antes de intentar nuevamente.
        </div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}

export default ContactForm;
```

---

## Notas Importantes

### Seguridad

1. **Honeypot Field**: Siempre incluye el campo `website` vacío en los formularios de contacto. Es una medida anti-spam.

2. **Rate Limiting**: Los formularios de contacto tienen límite de 5 envíos por minuto por IP. Implementa mensajes claros cuando se exceda.

3. **Validación Client-Side**: Aunque la API valida, implementa validación en el frontend para mejor UX.

### Performance

1. **Paginación**: Usa `per_page` apropiado para tu UI (default: 15). No excedas 100.

2. **Caché**: Considera cachear respuestas de productos destacados y categorías en el frontend.

3. **Eager Loading**: La API ya incluye relaciones cargadas. No hagas múltiples requests para obtener datos relacionados.

### SEO

1. Los campos `seo.title` y `seo.description` del detalle de producto deben usarse para meta tags.

2. Las URLs usan slugs amigables - úsalos en tu routing.

### UTM Tracking

Captura parámetros UTM de la URL y envíalos en formularios de contacto:
```javascript
const params = new URLSearchParams(window.location.search);
const utmParams = {
  utm_source: params.get('utm_source'),
  utm_medium: params.get('utm_medium'),
  utm_campaign: params.get('utm_campaign'),
};
```

---

## Soporte

Para preguntas o problemas con la API, contacta al equipo de backend.

