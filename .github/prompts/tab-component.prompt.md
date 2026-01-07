---
agent: agent
model: Auto (copilot)
tools: ['execute/testFailure', 'execute/getTaskOutput', 'execute/runInTerminal', 'execute/runTests', 'read/problems', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/createDirectory', 'edit/createFile', 'edit/editFiles', 'search/fileSearch', 'search/searchResults', 'search/textSearch', 'search/usages', 'web/fetch', 'next-devtools/*', 'gsap/*']
---


> Actúa como un **frontend engineer senior** especializado en **Next.js (App Router) y Tailwind CSS**.
> Tu objetivo es **crear un componente reutilizable tipo Tabs / Navigation Selector**, pensado para usarse en distintas secciones del sitio.



## 🧩 Nombre del componente

**`SectionTabs`**

Debe ser **totalmente reutilizable**, configurable por props y desacoplado de cualquier página específica.



## 📐 Descripción del diseño

El componente renderiza una **barra horizontal de tabs** sobre un **fondo negro sólido**, con **tres o más botones rectangulares** alineados en fila.

Cada tab representa una sección, la cual podra estar anclado a un ID para:
- Hacer scroll a esa sección 
- Cambiar de sección como un tab normal

Cualquiera de estas dos acciones puede ocurrir dependiendo de la configuración

Uno de los tabs puede estar **activo**, y su estilo visual debe reflejarlo claramente.



## 🎨 Estilo visual

### Tabs (comunes)

* Tipografía: sans-serif moderna (Inter / system-ui)
* Texto en **mayúsculas**
* Texto centrado horizontal y verticalmente
* Altura uniforme
* Ancho automático según el texto
* Bordes rectos (sin border-radius o con radio mínimo)
* Transiciones suaves



### Tab activo

* Fondo: amarillo/naranja intenso (`#FFB000` aprox.)
* Texto: negro o casi negro
* Cursor: default
* Sin efecto hover adicional



### Tabs inactivos

* Fondo: azul petróleo oscuro (`#0A3A4A` aprox.)
* Texto: blanco
* Cursor: pointer



## ✨ Estados interactivos (OBLIGATORIOS)

### Hover (tabs inactivos)

* Fondo ligeramente más claro
* `transition-colors duration-200`

### Focus (accesibilidad)

* Usar `focus-visible`
* Outline visible
* Color del outline:

  * Amarillo para el activo
  * Azul claro para inactivos
* No remover accesibilidad por defecto



## 📏 Layout y espaciado

* Contenedor principal:

  * `flex items-center`
  * `gap-6` o `gap-8`
  * `bg-black`
  * Padding externo opcional (`p-4` o configurable)

* Tabs:

  * Padding horizontal: `px-8` / `px-10`
  * Padding vertical: `py-4`



## 🧠 API del componente (OBLIGATORIA)

### Props esperadas:

```ts
type TabItem = {
  id: string
  label: string
}

type SectionTabsProps = {
  tabs: TabItem[]
  activeTabId: string
  onTabChange: (id: string) => void
  className?: string
}
```



## ⚙️ Reglas técnicas

* Usar **Next.js App Router**
* Declarar el componente como **Client Component** si usa estado o eventos
* Usar **Tailwind CSS**
* Usar `clsx` o lógica condicional para clases
* No hardcodear textos
* No incluir lógica de routing (solo UI)
* Código claro, comentado y listo para producción



## 📦 Resultado esperado

* Un archivo `SectionTabs.tsx`
* Un componente reutilizable y desacoplado
* Ejemplo corto de uso (opcional, pero deseable)
* Cumple accesibilidad básica (focus, keyboard)



## 🚫 No hacer

* No usar estilos inline
* No usar librerías externas de UI
* No acoplarlo a una página específica
* No asumir cantidad fija de tabs

